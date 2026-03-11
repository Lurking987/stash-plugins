import { state } from './state.js';
import { ALL_GENDERS } from './constants.js';
import { parsePerformerEloData } from './math-utils.js';
import { graphqlQuery, getPerformerBattleRank, isBattleRankBadgeEnabled, fetchAllPerformerStats } from './api-client.js';
import { formatDuration, getCountryDisplay, getGenderDisplay, escapeHtml } from './formatters.js';
import { getUrlPerformerFilter } from './parsers.js';
import { loadNewPair } from './battle-engine.js';
import { handleSkip } from './match-handler.js';

/**
 * ============================================
 * 1. CARD RENDERING
 * ============================================
 */

export function renderCard(item, side, rank) {
  const streak = (state.gauntletChampion?.id === item.id) ? state.gauntletWins : null;
  if (state.battleType === "performers") return createPerformerCard(item, side, rank, streak);
  if (state.battleType === "images") return createImageCard(item, side, rank, streak);
  return createSceneCard(item, side, rank, streak);
}

export function createSceneCard(scene, side, rank = null, streak = null) {
  const file = scene.files?.[0] || {};
  const performers = scene.performers?.map(p => p.name).join(", ") || "No performers";
  const studio = scene.studio?.name || "No studio";
  const tags = scene.tags?.slice(0, 5).map(t => t.name) || [];
  const title = scene.title || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "") || `Scene #${scene.id}`;
  
  const screenshotPath = scene.paths?.screenshot;
  const previewPath = scene.paths?.preview;
  const stashRating = scene.rating100 ? `${scene.rating100}/100` : "Unrated";
  
  const rankDisplay = rank != null ? `<span class="hon-scene-rank">${typeof rank === 'number' ? '#' + rank : rank}</span>` : '';
  const streakDisplay = (streak != null && streak > 0) ? `<div class="hon-streak-badge">🔥 ${streak} win${streak > 1 ? 's' : ''}</div>` : '';

  return `
    <div class="hon-scene-card" data-scene-id="${scene.id}" data-side="${side}" data-rating="${scene.rating100 || 50}">
      <div class="hon-scene-image-container" data-scene-url="/scenes/${scene.id}">
        ${screenshotPath ? `<img class="hon-scene-image" src="${screenshotPath}" alt="${title}" loading="lazy" />` : `<div class="hon-scene-image hon-no-image">No Screenshot</div>`}
        ${previewPath ? `<video class="hon-hover-preview" src="${previewPath}" loop playsinline></video>` : ''}
        <div class="hon-scene-duration">${formatDuration(file.duration)}</div>
        ${streakDisplay}
        <div class="hon-click-hint">Click to open scene</div>
      </div>
      <div class="hon-scene-body" data-winner="${scene.id}">
        <div class="hon-scene-info">
          <div class="hon-scene-title-row"><h3 class="hon-scene-title">${title}</h3>${rankDisplay}</div>
          <div class="hon-scene-meta">
            <div class="hon-meta-item"><strong>Studio:</strong> ${studio}</div>
            <div class="hon-meta-item"><strong>Performers:</strong> ${performers}</div>
            <div class="hon-meta-item"><strong>Rating:</strong> ${stashRating}</div>
          </div>
        </div>
        <div class="hon-choose-btn">✓ Choose This Scene</div>
      </div>
    </div>`;
}

export function createVictoryScreen(champion) {
    // Handle scenes, performers, and images
    let title, imagePath;
    
    if (state.battleType === "performers") {
      // Performer
      title = champion.name || `Performer #${champion.id}`;
      imagePath = champion.image_path;
    } else if (state.battleType === "images") {
      // Image
      title = `Image #${champion.id}`;
      imagePath = champion.paths && champion.paths.thumbnail ? champion.paths.thumbnail : null;
    } else {
      // Scene
      const file = champion.files && champion.files[0] ? champion.files[0] : {};
      title = champion.title;
      if (!title && file.path) {
        const pathParts = file.path.split(/[/\\]/);
        title = pathParts[pathParts.length - 1].replace(/\.[^/.]+$/, "");
      }
      if (!title) {
        title = `Scene #${champion.id}`;
      }
      imagePath = champion.paths ? champion.paths.screenshot : null;
    }
    
    const itemType = state.battleType === "performers" ? "performers" : (state.battleType === "images" ? "images" : "scenes");
    
    return `
      <div class="hon-victory-screen">
        <div class="hon-victory-crown">👑</div>
        <h2 class="hon-victory-title">CHAMPION!</h2>
        <div class="hon-victory-scene">
          ${imagePath 
            ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />`
            : `<div class="hon-victory-image hon-no-image">No Image</div>`
          }
        </div>
        <h3 class="hon-victory-name">${title}</h3>
        <p class="hon-victory-stats">Conquered all ${state.totalItemsCount} with ${state.gauntletWins} wins!</p>
        <button id="hon-new-gauntlet" class="btn btn-primary">Start New Gauntlet</button>
      </div>
    `;
}

/**
 * ============================================
 * 2. MAIN DASHBOARD UI
 * ============================================
 */

export function createMainUI() {
  const isPerformers = state.battleType === "performers";
  
  const MODE_LABELS = {
    swiss: "⚖️ Swiss",
    gauntlet: "🥊 Gauntlet",
    champion: "👑 Champion"
  };

  const modeToggleHTML = state.battleType !== "images" ? `
    <div class="hon-mode-toggle">
      ${['swiss', 'gauntlet', 'champion'].map(mode => `
        <button class="hon-mode-btn ${state.currentMode === mode ? 'active' : ''}" data-mode="${mode}">
          ${MODE_LABELS[mode]}
        </button>`).join('')}
    </div>` : '';

  const genderFilterHTML = isPerformers ? `
    <div class="hon-gender-filter">
      <div class="hon-gender-btns">
        ${(typeof ALL_GENDERS !== 'undefined' ? ALL_GENDERS : []).map(g => `
          <button 
            class="hon-gender-btn ${state.selectedGenders.includes(g.value) ? 'active' : ''}" 
            data-gender="${g.value}"
          >
            ${g.label}
          </button>`).join('')}
      </div>
    </div>` : '';

  // ONLY ONE RETURN STATEMENT AT THE END
  return `
    <div id="hotornot-container" class="hon-container">
      <div class="hon-header">
        <h1 class="hon-title">🔥 HotOrNot</h1>
        ${modeToggleHTML}
        ${genderFilterHTML}
        ${isPerformers ? `<button id="hon-stats-btn" class="btn btn-primary">📊 View All Stats</button>` : ''}
      </div>
      <div id="hon-performer-selection" style="display: none;">
        <div id="hon-performer-list">Loading...</div>
      </div>
      <div class="hon-content">
        <div id="hon-comparison-area">
            <div class="hon-loading">Loading...</div>
        </div>
        <div class="hon-actions">
          <button id="hon-skip-btn" class="btn btn-secondary">Skip (Space)</button>
        </div>
        <div class="hon-keyboard-hints">
          <span class="hon-hint"><strong>⬅️</strong> Choose Left</span>
          <span class="hon-hint"><strong>➡️</strong> Choose Right</span>
          <span class="hon-hint"><strong>Space</strong> to Skip</span>
        </div>
      </div>
    </div>`;
}

export function attachEventListeners(parent = document) {
    // 1. Stats Button
    parent.querySelector("#hon-stats-btn")?.addEventListener("click", openStatsModal);
    
    // 2. Performer Image Links (Prevent "Choosing" when just viewing profile)
	parent.querySelectorAll('.hon-performer-link, .hon-gauntlet-select-img').forEach(link => {
		link.addEventListener('click', (e) => {
			e.stopPropagation(); 
		});
	});
	
    // 3. Skip Button (already looks good in your draft)
    const skipBtn = parent.querySelector("#hon-skip-btn");
    if (skipBtn) {
      skipBtn.style.display = (state.currentMode === 'swiss') ? 'block' : 'none';
      skipBtn.onclick = () => {
        if (state.currentMode === 'swiss') handleSkip();
      };
    }

    // 4. Gender Toggles
    parent.querySelectorAll(".hon-gender-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            handleGenderToggle(btn.dataset.gender);
        });
    });

    // 5. Mode Switches
    parent.querySelectorAll(".hon-mode-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const newMode = btn.dataset.mode;
            if (state.currentMode === newMode) return;

            // --- RESET LOGIC ---
            state.currentMode = newMode;
            state.gauntletChampion = null;
            state.gauntletFalling = false;
            state.gauntletWins = 0;
            state.gauntletDefeated = [];

            // RE-RENDER: If we are in the Modal, update the Modal. If in Dashboard, update Dashboard.
            const modalContent = document.querySelector(".hon-modal-content");
            const mainContainer = document.getElementById('stash-main-container');

            if (modalContent) {
                modalContent.innerHTML = `<span class="hon-modal-close">✕</span>${createMainUI()}`;
                attachEventListeners(modalContent); // Re-wire the new HTML
                // Re-add close button listener specifically for modal
                modalContent.querySelector(".hon-modal-close").onclick = () => closeRankingModal();
            } else if (mainContainer) {
                mainContainer.innerHTML = createMainUI();
                attachEventListeners(mainContainer);
            }

            // Start the game
            if (newMode === "gauntlet") {
                window.showPerformerSelection();
            } else {
                loadNewPair();
            }
        });
    });
}

/**
 * Handles toggling genders in the filter
 */
export function handleGenderToggle(gender) {
    // 1. Update Global State
    if (state.selectedGenders.includes(gender)) {
        // If already selected, remove it (unless it's the last one, optional)
        state.selectedGenders = state.selectedGenders.filter(g => g !== gender);
    } else {
        // Otherwise, add it
        state.selectedGenders.push(gender);
    }

    console.log(`[HotOrNot] Gender Filter Updated: ${state.selectedGenders.join(', ')}`);

    // 2. Visual Update (Sync all buttons in the UI)
    // This finds every gender button on the screen and toggles its 'active' class
    const allGenderButtons = document.querySelectorAll(`.hon-gender-btn[data-gender="${gender}"]`);
    allGenderButtons.forEach(btn => {
        const isActive = state.selectedGenders.includes(gender);
        btn.classList.toggle("active", isActive);
    });

    // 3. Data Refresh
    // Since the filters changed, the current pair might no longer be valid.
    // We trigger a "Skip" logic or just load a new pair to respect the new filter.
    if (typeof loadNewPair === 'function') {
        loadNewPair(); 
    } else if (window.hotOrNot?.loadNewPair) {
        window.hotOrNot.loadNewPair();
    }
}

export function setMode(mode) {
  // 1. Hide ALL possible areas first
  document.getElementById("hon-performer-selection").style.display = "none";
  document.getElementById("hon-comparison-area").style.display = "none";
  // ... hide others

  // 2. Show only the one for the selected mode
  if (mode === 'gauntlet') {
    showPerformerSelection(); // from gauntlet-selection.js
  } else if (mode === 'champion') {
    showChampionMode(); 
  }
}


/**
 * ============================================
 * 3. NAVIGATION & MODAL CONTROL
 * ============================================
 */
export function shouldShowButton() {
  return ['/performers', '/performers/', '/images', '/images/'].includes(window.location.pathname);
}

export function addFloatingButton() {
  if (document.getElementById("hon-floating-btn")) return;
  if (!shouldShowButton()) return;

  const btn = document.createElement("button");
  btn.id = "hon-floating-btn";
  btn.innerHTML = "🔥";
  // FIX: Use the window global so the click works in the bundle
  btn.onclick = () => window.openRankingModal(); 
  document.body.appendChild(btn);
  btn.setAttribute("onclick", "window.openRankingModal()");
}

// Move this outside so closeRankingModal can see it to remove it
function handleGlobalKeys(e) {
  const activeModal = document.getElementById("hon-modal-container");
  if (!activeModal) {
    document.removeEventListener("keydown", handleGlobalKeys);
    return;
  }

  const hotKeys = ["ArrowLeft", "ArrowRight", " ", "Space"];
  if (hotKeys.includes(e.key) || hotKeys.includes(e.code)) {
    e.stopImmediatePropagation();
    e.preventDefault();

    if (e.key === "ArrowLeft") {
      activeModal.querySelector('.hon-scene-card[data-side="left"] .hon-scene-body')?.click();
    }
    if (e.key === "ArrowRight") {
      activeModal.querySelector('.hon-scene-card[data-side="right"] .hon-scene-body')?.click();
    }
    if (e.key === " " || e.code === "Space") {
      document.getElementById("hon-skip-btn")?.click();
    }
  }
}

export function openRankingModal() {
    try {
        const path = window.location.pathname;
        state.battleType = path.includes('/images') ? "images" : "performers";

        const existing = document.getElementById("hon-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "hon-modal";
        modal.innerHTML = `
          <div class="hon-modal-backdrop"></div>
          <div class="hon-modal-content">
            <span class="hon-modal-close">✕</span>
            ${createMainUI()}
          </div>
        `;
        document.body.appendChild(modal);
        //modal.style.display = "block";

        // 1. Basic Modal Controls
        modal.querySelector(".hon-modal-close").onclick = () => closeRankingModal();
        modal.querySelector(".hon-modal-backdrop").onclick = () => closeRankingModal();

        // 2. USE THE REUSABLE ATTACH FUNCTION
        attachEventListeners(modal);

        // 3. Start the game
        if (state.currentMode === "gauntlet") {
            window.showPerformerSelection();
        } else {
            loadNewPair();
        }

        document.addEventListener("keydown", handleGlobalKeys);
    } catch (err) {
        console.error("CRASH in openRankingModal:", err);
    }
}

export function closeRankingModal() {
    const gameModal = document.getElementById("hon-modal");
    const statsModal = document.getElementById("hon-stats-modal");
    
    if (gameModal) gameModal.remove();
    if (statsModal) statsModal.remove(); // Clean up the "outside" div too
    
    document.removeEventListener("keydown", handleGlobalKeys);
}

/**
 * Internal Helper: Handles Tab Switching Logic
 */
function initStatsTabs(dialog) {
  const buttons = dialog.querySelectorAll(".hon-stats-tab");
  const panels = dialog.querySelectorAll(".hon-stats-tab-panel");

  buttons.forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.toggle("active", b === btn));
      panels.forEach(p => p.classList.toggle("active", p.dataset.panel === target));
    };
  });
}

/**
 * Internal Helper: Handles Expand/Collapse Logic
 */
function initStatsCollapsibles(dialog) {
  const headers = dialog.querySelectorAll(".hon-rank-group-header, .hon-bar-group-header");
  headers.forEach(header => {
    header.onclick = () => {
      const groupType = header.classList.contains("hon-rank-group-header") ? ".hon-rank-group-content" : ".hon-bar-group-content";
      const content = dialog.querySelector(`${groupType}[data-group="${header.dataset.group}"]`);
      
      const isCollapsed = content.classList.toggle("collapsed");
      header.setAttribute("aria-expanded", !isCollapsed);
      header.querySelector(".hon-group-toggle").textContent = isCollapsed ? "▶" : "▼";
    };
  });
}

/**
 * ============================================
 * 4. ADDITIONAL ITEM CARDS
 * ============================================
 */

export function createPerformerCard(performer, side, rank = null, streak = null) {
  const name = performer.name || `Performer #${performer.id}`;
  const imagePath = performer.image_path || null;
  const stashRating = performer.rating100 ? `${performer.rating100}/100` : "Unrated";
  
  const rankDisplay = rank != null ? `<span class="hon-performer-rank hon-scene-rank">#${rank}</span>` : '';
  const streakDisplay = (streak != null && streak > 0) ? `<div class="hon-streak-badge">🔥 ${streak} wins</div>` : '';

  return `
    <div class="hon-performer-card hon-scene-card" data-performer-id="${performer.id}" data-side="${side}" data-rating="${performer.rating100 || 50}">
      <div class="hon-performer-image-container hon-scene-image-container">
        <!-- ADDED: Anchor tag around the image -->
        <a href="/performers/${performer.id}" target="_blank" class="hon-performer-link">
          ${imagePath ? `<img class="hon-performer-image hon-scene-image" src="${imagePath}" alt="${name}" />` : `<div class="hon-no-image">No Image</div>`}
        </a>
        ${streakDisplay}
      </div>
      <!-- Ensure data-winner is on the clickable body area -->
      <div class="hon-performer-body hon-scene-body" data-winner="${performer.id}">
        <div class="hon-performer-info hon-scene-info">
          <div class="hon-performer-title-row hon-scene-title-row">
            <h3 class="hon-performer-title hon-scene-title">${name}</h3>
            ${rankDisplay}
          </div>
          <div class="hon-performer-meta hon-scene-meta">
            <div class="hon-meta-item"><strong>Country:</strong> ${getCountryDisplay(performer.country)}</div>
            <div class="hon-meta-item"><strong>Gender:</strong> ${getGenderDisplay(performer.gender)}</div>
            <div class="hon-meta-item"><strong>Rating:</strong> ${stashRating}</div>
          </div>
        </div>
        <div class="hon-choose-btn">✓ Choose This Performer</div>
      </div>
    </div>`;
}

export function createImageCard(image, side, rank = null, streak = null) {
  const thumbnailPath = image.paths?.thumbnail || null;
  const rankDisplay = rank != null ? `<span class="hon-image-rank hon-scene-rank">#${rank}</span>` : '';
  const streakDisplay = (streak != null && streak > 0) ? `<div class="hon-streak-badge">🔥 ${streak}</div>` : '';

  return `
    <div class="hon-image-card hon-scene-card" data-image-id="${image.id}" data-side="${side}" data-rating="${image.rating100 || 50}">
      <div class="hon-image-image-container hon-scene-image-container" data-image-url="/images/${image.id}">
        ${thumbnailPath ? `<img class="hon-scene-image" src="${thumbnailPath}" />` : `<div class="hon-no-image">No Image</div>`}
        ${streakDisplay}
        ${rankDisplay ? `<div class="hon-image-rank-overlay">${rankDisplay}</div>` : ''}
      </div>
      <div class="hon-image-body hon-scene-body" data-winner="${image.id}">
        <div class="hon-choose-btn">✓ Choose This Image</div>
      </div>
    </div>`;
}
/**
 * Renders the Placement screen when a Gauntlet run ends by "finding the floor"
 */
export function showPlacementScreen(item, rank, finalRating, battleType, totalItemsCount) {
  const area = document.getElementById("hon-comparison-area");
  if (!area) return;
  
  let title, imagePath;
  if (battleType === "performers") {
    title = item.name || `Performer #${item.id}`;
    imagePath = item.image_path;
  } else if (battleType === "images") {
    title = `Image #${item.id}`;
    imagePath = item.paths?.thumbnail || null;
  } else {
    const file = item.files?.[0] || {};
    title = item.title || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "") || `Scene #${item.id}`;
    imagePath = item.paths?.screenshot || null;
  }
  
  area.innerHTML = `
    <div class="hon-victory-screen">
      <div class="hon-victory-crown">📍</div>
      <h2 class="hon-victory-title">PLACED!</h2>
      <div class="hon-victory-scene">
        ${imagePath ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />` : `<div class="hon-victory-image hon-no-image">No Image</div>`}
      </div>
      <h3 class="hon-victory-name">${title}</h3>
      <p class="hon-victory-stats">
        Rank <strong>#${rank}</strong> of ${totalItemsCount}<br>
        Rating: <strong>${finalRating}/100</strong>
      </p>
      <button id="hon-new-gauntlet" class="btn btn-primary">Start New Run</button>
    </div>
  `;
  
  // Clean up UI state
  document.getElementById("hon-gauntlet-status")?.remove();
  const actionsEl = document.querySelector(".hon-actions");
  if (actionsEl) actionsEl.style.display = "none";
}

/**
 * Internal Helper: Generates the paginated leaderboard table
 */
export function generateStatTables(processedPerformers) {
  const groups = [];
  const groupSize = 250;

  for (let i = 0; i < processedPerformers.length; i += groupSize) {
    const chunk = processedPerformers.slice(i, i + groupSize);
    const startRank = i + 1;
    const endRank = Math.min(i + groupSize, processedPerformers.length);

    const rows = chunk.map(p => {
      const winRate = p.total_matches > 0 ? ((p.wins / p.total_matches) * 100).toFixed(1) : 'N/A';
      const streakDisplay = p.current_streak > 0 
        ? `<span class="hon-stats-positive">+${p.current_streak}</span>` 
        : p.current_streak < 0 ? `<span class="hon-stats-negative">${p.current_streak}</span>` : '0';
      
      return `
        <tr>
          <td class="hon-stats-rank">#${p.rank}</td>
          <td class="hon-stats-name"><a href="/performers/${p.id}" target="_blank">${escapeHtml(p.name)}</a></td>
          <td class="hon-stats-rating">${p.rating}</td>
          <td>${p.total_matches}</td>
          <td class="hon-stats-positive">${p.wins}</td>
          <td class="hon-stats-negative">${p.losses}</td>
		  <td>${p.draws || 0}</td>
          <td>${winRate}%</td>
          <td>${streakDisplay}</td>
          <td class="hon-stats-positive">${p.best_streak}</td>
          <td class="hon-stats-negative">${p.worst_streak}</td>
        </tr>`;
    }).join('');

    groups.push(`
      <div class="hon-rank-group">
        <div class="hon-rank-group-header" data-group="${i}" role="button">
          <span class="hon-group-toggle">▶</span>
          <span class="hon-rank-group-title">Ranks ${startRank}-${endRank}</span>
        </div>
        <div class="hon-rank-group-content collapsed" data-group="${i}">
          <table class="hon-stats-table">
            <thead>
              <tr>
                <th>Rank</th><th>Name</th><th>Rating</th><th>Matches</th><th>W</th><th>L</th><th>D</th><th>%</th><th>Streak</th><th>Best</th><th>Worst</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`);
  }
  return groups.join('');
}

// Global flag to prevent double-injection
let badgeInjectionInProgress = false;

/**
 * Creates the detailed Battle Rank badge with tiers and match statistics
 */
export function createBattleRankBadge(rank, total, rating, stats = null) {
  const badge = document.createElement("div");
  badge.className = "hon-battle-rank-badge"; // Using the original class name
  badge.id = "hon-battle-rank-badge";
  
  // 1. Determine rank tier for styling
  const percentile = ((total - rank + 1) / total) * 100;
  let tierEmoji = "";
  
  if (percentile >= 95) {
    tierEmoji = "👑"; // Legendary
  } else if (percentile >= 80) {
    tierEmoji = "🥇"; // Gold
  } else if (percentile >= 60) {
    tierEmoji = "🥈"; // Silver
  } else if (percentile >= 40) {
    tierEmoji = "🥉"; // Bronze
  } else {
    tierEmoji = "🔥"; // Default
  }
  
  // 2. Build match stats HTML
  let matchStatsHTML = '';
  let winRate = "0.0";
  const hasMatchStats = stats && stats.total_matches > 0;
  
  if (hasMatchStats) {
    winRate = ((stats.wins / (stats.total_matches || 1)) * 100).toFixed(1);
    
    let streakDisplay = '';
    if (stats.current_streak > 0) {
      streakDisplay = `<span class="hon-streak-positive">W${stats.current_streak}</span>`;
    } else if (stats.current_streak < 0) {
      streakDisplay = `<span class="hon-streak-negative">L${Math.abs(stats.current_streak)}</span>`;
    }
    
    matchStatsHTML = `
      <span class="hon-match-stats">
        <span class="hon-stats-record">
          <span class="hon-wins">${stats.wins}W</span>
          <span class="hon-losses">${stats.losses}L</span>
          <span class="hon-draws">${stats.draws}D</span>
        </span>
        <span class="hon-win-rate">${winRate}%</span>
        ${streakDisplay}
      </span>
    `;
  }
  
  // 3. Assemble the Badge Inner HTML
  badge.innerHTML = `
    <span class="hon-rank-emoji">${tierEmoji}</span>
    <span class="hon-rank-text">Battle Rank #${rank}</span>
    <span class="hon-rank-total">of ${total}</span>
    ${matchStatsHTML}
  `;
  
  // 4. Build the Detailed Tooltip
  let tooltipText = `Battle Rank #${rank} of ${total} performers (Rating: ${rating}/100)`;
  if (hasMatchStats) {
    tooltipText += `\n\nMatch Stats:`;
    tooltipText += `\n• Record: ${stats.wins}W - ${stats.losses}L - ${stats.draws}D`;
    tooltipText += `\n• Win Rate: ${winRate}%`;
    tooltipText += `\n• Total Matches: ${stats.total_matches}`;
    if (stats.current_streak !== 0) {
      const streakType = stats.current_streak > 0 ? 'Winning' : 'Losing';
      tooltipText += `\n• Current Streak: ${streakType} ${Math.abs(stats.current_streak)}`;
    }
    if (stats.best_streak > 0) tooltipText += `\n• Best Streak: ${stats.best_streak}`;
    if (stats.worst_streak < 0) tooltipText += `\n• Worst Streak: ${Math.abs(stats.worst_streak)}`;
  }
  badge.title = tooltipText;
  
  return badge;
}


/**
 * Main Injection Logic
 */
export async function injectBattleRankBadge() {
  const pathParts = window.location.pathname.split('/');
  const pIndex = pathParts.indexOf('performers');
  if (pIndex === -1 || !pathParts[pIndex + 1]) return;
  const performerId = pathParts[pIndex + 1];

  setTimeout(async () => {
    if (window._honBadgeInjectionInProgress) return;
    window._honBadgeInjectionInProgress = true;
    try {
      const ratingEl = document.querySelector(".quality-group");

      if (ratingEl && !document.getElementById("hon-battle-rank-badge")) {
        const rankInfo = await getPerformerBattleRank(performerId);
        if (rankInfo) {
          const badge = createBattleRankBadge(
            rankInfo.rank,
            rankInfo.total,
            rankInfo.rating,
            rankInfo.stats
          );
		  ratingEl.append(badge);
        }
      }
    } finally {
      window._honBadgeInjectionInProgress = false;
    }
  }, 200);
}

export function showRatingAnimation(card, oldRating, newRating, change, isWinner) {
    const overlay = document.createElement("div");
    overlay.className = `hon-rating-overlay ${isWinner ? 'hon-rating-winner' : 'hon-rating-loser'}`;
    
    const ratingDisplay = document.createElement("div");
    ratingDisplay.className = "hon-rating-display";
    ratingDisplay.textContent = oldRating;
    
    const changeDisplay = document.createElement("div");
    changeDisplay.className = "hon-rating-change";
    changeDisplay.textContent = (change >= 0 ? "+" : "") + change;
    
    overlay.appendChild(ratingDisplay);
    overlay.appendChild(changeDisplay);
    card.appendChild(overlay);

    let currentDisplay = oldRating;
    const totalSteps = Math.abs(change);
    if (totalSteps > 0) {
        const step = isWinner ? 1 : -1;
        let stepCount = 0;
        const interval = setInterval(() => {
          stepCount++;
          currentDisplay += step;
          ratingDisplay.textContent = currentDisplay;
          if (stepCount >= totalSteps) {
            clearInterval(interval);
            ratingDisplay.textContent = newRating;
          }
        }, 30);
    }

    setTimeout(() => overlay.remove(), 1400);
}

function getPerformerIdFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/\/performers\/(\d+)/);
  return match ? match[1] : null;
}


/**
 * openStatsModal functions
 */
export function createStatsModalContent(performers) {
  if (!performers || performers.length === 0) {
    return '<div class="hon-stats-empty">No performer stats available</div>';
  }

  // 1. Map raw Stash data to UI-friendly objects
  const processedPerformers = performers.map((p, idx) => {
    const stats = parsePerformerEloData(p);
    const rawRating = p.rating100 ?? 50; // Use 50 if unrated
    
    return {
      ...stats,
      rank: idx + 1,
      id: p.id,
      name: p.name || `Performer #${p.id}`,
      rating: (rawRating / 10).toFixed(1) // Format 50 to "5.0"
    };
  });

  // 2. Generate the HTML for the leaderboard and bar graph
  const rankGroupsHTML = generateStatTables(processedPerformers);
  
  // Calculate distribution
  const ratingBuckets = new Array(101).fill(0);
  performers.forEach(p => {
    const r = p.rating100 ?? 50;
    if (r >= 0 && r <= 100) ratingBuckets[r]++;
  });

  return `
    <div class="hon-stats-header">
      <h2>📊 Performer Statistics</h2>
      <div class="hon-stats-tabs">
        <button class="hon-stats-tab active" data-tab="leaderboard">Leaderboard</button>
        <button class="hon-stats-tab" data-tab="distribution">Rating Distribution</button>
      </div>
    </div>
    <div class="hon-stats-content">
      <div class="hon-stats-tab-panel active" data-panel="leaderboard">
        ${rankGroupsHTML} 
      </div>
      <div class="hon-stats-tab-panel" data-panel="distribution">
        <div class="hon-bar-graph">
          ${generateBarGroups(ratingBuckets)}
        </div>
      </div>
    </div>
  `;
}


export async function openStatsModal() {
    const existingStatsModal = document.getElementById("hon-stats-modal");
    if (existingStatsModal) {
      existingStatsModal.remove();
    }

    const statsModal = document.createElement("div");
    statsModal.id = "hon-stats-modal";
    // Ensure it has the class for your new high-z-index CSS
    statsModal.className = "hon-stats-modal"; 
    statsModal.innerHTML = `
      <div class="hon-modal-backdrop"></div>
      <div class="hon-stats-modal-dialog">
        <button class="hon-modal-close">✕</button>
        <div class="hon-stats-loading">Loading stats...</div>
      </div>
    `;

    document.body.appendChild(statsModal);

    const closeStats = () => statsModal.remove();
    
    // --- CLICK PROTECTION ---
    const dialogContainer = statsModal.querySelector(".hon-stats-modal-dialog");
    
    // Prevent clicks inside the white/dark stats box from "bubbling" up 
    // and hitting the backdrop (which triggers the close)
    dialogContainer.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Only clicking the actual dark backdrop closes the stats
    statsModal.querySelector(".hon-modal-backdrop").addEventListener("click", closeStats);
    statsModal.querySelector(".hon-modal-close").addEventListener("click", closeStats);

    try {
      // 1. Fetch data from your api-client
      const performers = await fetchAllPerformerStats();
      
      // 2. Generate content
      const content = createStatsModalContent(performers);
      
      // Update the dialog content
      dialogContainer.innerHTML = `
        <button class="hon-modal-close">✕</button>
        ${content}
      `;
      
	  dialogContainer.addEventListener("click", (e) => e.stopPropagation());
	  
      // Re-attach close listener for the NEW button we just injected
      dialogContainer.querySelector(".hon-modal-close").addEventListener("click", closeStats);

      // 3. Tab Switching Logic
      const tabButtons = dialogContainer.querySelectorAll(".hon-stats-tab");
      const tabPanels = dialogContainer.querySelectorAll(".hon-stats-tab-panel");
      
      tabButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          e.stopPropagation(); // Safety first
          const tabName = button.dataset.tab;
          tabButtons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          tabPanels.forEach(panel => {
            panel.classList.toggle("active", panel.dataset.panel === tabName);
          });
        });
      });

      // 4. Collapsible Group Logic
      const attachCollapseHandlers = (headerSelector, contentSelector) => {
        const headers = dialogContainer.querySelectorAll(headerSelector);
        headers.forEach(header => {
          header.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent modal from closing on header click
            const groupIndex = header.dataset.group;
            const contentPanel = dialogContainer.querySelector(`${contentSelector}[data-group="${groupIndex}"]`);
            const toggle = header.querySelector(".hon-group-toggle");
            
            if (contentPanel && contentPanel.classList.toggle("collapsed")) {
              header.setAttribute("aria-expanded", "false");
              if (toggle) toggle.textContent = "▶";
            } else if (contentPanel) {
              header.setAttribute("aria-expanded", "true");
              if (toggle) toggle.textContent = "▼";
            }
          });
        });
      };

      attachCollapseHandlers(".hon-rank-group-header", ".hon-rank-group-content");
      attachCollapseHandlers(".hon-bar-group-header", ".hon-bar-group-content");
      
    } catch (error) {
      console.error("[HotOrNot] Error loading stats:", error);
      dialogContainer.innerHTML = `
        <button class="hon-modal-close">✕</button>
        <div class="hon-stats-error">Failed to load statistics.</div>
      `;
      dialogContainer.querySelector(".hon-modal-close").addEventListener("click", closeStats);
    }
}

/**
 * Internal Helper: Generates the granular bars for the stats distribution graph
 */
export function generateBarGroups(ratingBuckets) {
  // Find the highest count to scale the bars proportionally
  const maxBucket = Math.max(...ratingBuckets, 1);
  
  // Group the 100 buckets into 10 main groups (0-10, 11-20, etc.) 
  // or show all 100 if you want high detail.
  return ratingBuckets.map((count, i) => {
    if (count === 0) return ''; // Skip empty bars to keep the UI clean
    
    const percentage = (count / maxBucket) * 100;
    // ratingBuckets index i corresponds to the rating (0-100)
    return `
      <div class="hon-bar-container" title="Rating ${i}: ${count} performers">
        <div class="hon-bar-label">${i}</div>
        <div class="hon-bar-wrapper">
          <div class="hon-bar" style="width: ${percentage}%">
            ${count > 5 ? `<span class="hon-bar-count">${count}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

/**
 * ============================================
 * 5. PERFORMER PAGE
 * ============================================
 */

export function isOnSinglePerformerPage() {
  return window.location.pathname.includes('/performers/') && 
         !window.location.pathname.endsWith('/performers');
}
