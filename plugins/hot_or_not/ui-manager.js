import { state } from './state.js';
import { ALL_GENDERS } from './constants.js';
import { parsePerformerEloData } from './math-utils.js';
import { graphqlQuery, getPerformerBattleRank, isBattleRankBadgeEnabled } from './api-client.js';
import { formatDuration, getCountryDisplay, getGenderDisplay, escapeHtml } from './formatters.js';
import { getUrlPerformerFilter } from './parsers.js';
import { loadNewPair } from './battle-engine.js';

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

/**
 * ============================================
 * 2. MAIN DASHBOARD UI
 * ============================================
 */

export function createMainUI() {
  const { battleType, currentMode, selectedGenders } = state;
  const isPerformers = battleType === "performers";
  const itemType = isPerformers ? "performers" : (battleType === "images" ? "images" : "scenes");
  
  const modeToggleHTML = battleType !== "images" ? `
    <div class="hon-mode-toggle">
      ${['swiss', 'gauntlet', 'champion'].map(mode => `
        <button class="hon-mode-btn ${currentMode === mode ? 'active' : ''}" data-mode="${mode}">
          ${mode.toUpperCase()}
        </button>`).join('')}
    </div>` : '';

  const genderFilterHTML = isPerformers ? `
    <div class="hon-gender-filter">
      <div class="hon-gender-btns">
        ${ALL_GENDERS.map(g => `
          <button class="hon-gender-btn ${selectedGenders.includes(g.value) ? 'active' : ''}" data-gender="${g.value}">
            ${g.label}
          </button>`).join('')}
      </div>
    </div>` : '';

  return `
    <div id="hotornot-container" class="hon-container">
      <div class="hon-header">
        <h1 class="hon-title">🔥 HotOrNot</h1>
        ${modeToggleHTML}${genderFilterHTML}
        ${isPerformers ? `<button id="hon-stats-btn" class="btn btn-primary">📊 View All Stats</button>` : ''}
      </div>
      <div id="hon-performer-selection" style="display: none;"><div id="hon-performer-list">Loading...</div></div>
      <div class="hon-content">
        <div id="hon-comparison-area"><div class="hon-loading">Loading...</div></div>
        <div class="hon-actions"><button id="hon-skip-btn" class="btn btn-secondary">Skip (Space)</button></div>
      </div>
    </div>`;
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
  btn.onclick = openRankingModal;
  document.body.appendChild(btn);
}

export function openRankingModal() {
  if (window.location.pathname.includes('/images')) {
    state.battleType = "images";
    state.currentMode = "swiss";
  } else {
    state.battleType = "performers";
    state.cachedUrlFilter = getUrlPerformerFilter();
  }

  document.getElementById("hon-modal")?.remove();
  const modal = document.createElement("div");
  modal.id = "hon-modal";
  modal.innerHTML = `
    <div class="hon-modal-backdrop"></div>
    <div class="hon-modal-content">
      <button class="hon-modal-close">✕</button>
      ${createMainUI()}
    </div>`;
  document.body.appendChild(modal);

  // Close Logic
  const close = () => modal.remove();
  modal.querySelector(".hon-modal-backdrop").onclick = close;
  modal.querySelector(".hon-modal-close").onclick = close;

  loadNewPair();
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
      <div class="hon-performer-image-container hon-scene-image-container" data-performer-url="/performers/${performer.id}">
        ${imagePath ? `<img class="hon-performer-image hon-scene-image" src="${imagePath}" alt="${name}" />` : `<div class="hon-no-image">No Image</div>`}
        ${streakDisplay}
      </div>
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
 * Internal Helper: Generates the granular bars for the stats dashboard
 */
export function generateBarGroups(ratingBuckets) {
  const maxBucket = Math.max(...ratingBuckets, 1);
  return ratingBuckets.map((count, i) => {
    const percentage = (count / maxBucket) * 100;
    const ratingLabel = (i / 10).toFixed(1);
    return `
      <div class="hon-bar-container">
        <div class="hon-bar-label">${ratingLabel}</div>
        <div class="hon-bar-wrapper">
          <div class="hon-bar" style="width: ${percentage}%">
            ${count > 0 ? `<span class="hon-bar-count">${count}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

/**
 * Internal Helper: Generates the paginated leaderboard table
 */
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
                <th>Rank</th><th>Name</th><th>Rating</th><th>Matches</th><th>W</th><th>L</th><th>%</th><th>Streak</th><th>Best</th><th>Worst</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`);
  }
  return groups.join('');
}

/**
 * Visual feedback showing the rating change on the card
 */
export function showRatingAnimation(card, oldRating, newRating, change, isWinner) {
  const body = card.querySelector('.hon-scene-body, .hon-performer-body, .hon-image-body');
  if (!body) return;

  // Create the animation element
  const anim = document.createElement("div");
  anim.className = `hon-rating-animation ${isWinner ? 'is-winner' : 'is-loser'}`;
  
  // Format the change text (e.g., +5 or -3)
  const changeText = change >= 0 ? `+${change}` : `${change}`;
  
  anim.innerHTML = `
    <div class="hon-anim-old">${oldRating}</div>
    <div class="hon-anim-change">${changeText}</div>
    <div class="hon-anim-new">${newRating}</div>
  `;

  body.appendChild(anim);

  // Remove element after animation completes
  setTimeout(() => anim.remove(), 1400);
}

/**
 * Helpers for Performer Page Integration
 */
function getPerformerIdFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/\/performers\/(\d+)/);
  return match ? match[1] : null;
}

export function isOnSinglePerformerPage() {
  return getPerformerIdFromUrl() !== null;
}

// Global flag to prevent double-injection
let badgeInjectionInProgress = false;

/**
 * Internal helper to create the badge element
 */
function createBattleRankBadge(rank, total, rating) {
  const badge = document.createElement("div");
  badge.id = "hon-battle-rank-badge";
  badge.className = "hon-badge"; // Style this in your CSS
  badge.innerHTML = `🔥 Rank #${rank} of ${total} (${rating}/100)`;
  return badge;
}

/**
 * Main Injection Logic
 */
export async function injectBattleRankBadge() {
  if (!await isBattleRankBadgeEnabled()) return;
  if (window._honBadgeInjectionInProgress) return;

  window._honBadgeInjectionInProgress = true;
  try {
    const performerId = getPerformerIdFromUrl();
    if (!performerId || document.getElementById("hon-battle-rank-badge")) return;

    const rankInfo = await getPerformerBattleRank(performerId);
    if (!rankInfo) return;

    const badge = createBattleRankBadge(rankInfo.rank, rankInfo.total, rankInfo.rating);
    
    // Find injection point (Stash detail page header)
    const target = document.querySelector(".rating-stars") || 
                   document.querySelector(".performer-head") || 
                   document.querySelector(".detail-header");
    
    if (target) target.appendChild(badge);
  } finally {
    window._honBadgeInjectionInProgress = false;
  }
}

export function isOnSinglePerformerPage() {
  return window.location.pathname.match(/\/performers\/\d+/) !== null;
}

function getPerformerIdFromUrl() {
  const match = window.location.pathname.match(/\/performers\/(\d+)/);
  return match ? match[1] : null;
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
