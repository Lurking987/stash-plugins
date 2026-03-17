import { state } from './state.js';
import { ALL_GENDERS } from './constants.js';
import { loadNewPair } from './battle-engine.js';
import { handleSkip, handleUndo } from './match-handler.js';

/**
 * ============================================
 * MAIN DASHBOARD UI
 * ============================================
 */

export function createMainUI() {
  const isPerformers = state.battleType === "performers";

  const MODE_CONFIG = {
    swiss:    { icon: "⚖️",  label: "Swiss" },
    gauntlet: { icon: "🥊", label: "Gauntlet" },
    champion: { icon: "👑", label: "Champion" },
  };

  const modeToggleHTML = state.battleType !== "images" ? `
    <div class="hon-mode-toggle">
      ${['swiss', 'gauntlet', 'champion'].map(mode => `
        <button class="hon-mode-btn ${state.currentMode === mode ? 'active' : ''}" data-mode="${mode}">
          <span class="hon-mode-icon">${MODE_CONFIG[mode].icon}</span>
          <span class="hon-mode-title">${MODE_CONFIG[mode].label}</span>
        </button>`).join('')}
    </div>` : '';

  // Do NOT reset selectedGenders here — it is managed by main.js (synced from URL)
  // and state.js (default: ["FEMALE"]). Resetting on every UI render would stomp
  // on the auto-detected filter.

  const genderFilterHTML = isPerformers ? `
    <div class="hon-gender-filter">
      <div class="hon-gender-btns">
        ${ALL_GENDERS.map(g => `
          <button
            class="hon-gender-btn ${state.selectedGenders.includes(g.value) ? 'active' : ''}"
            data-gender="${g.value}"
          >
            ${g.label}
          </button>`).join('')}
      </div>
    </div>` : '';

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
          <button id="hon-undo-btn" class="btn btn-secondary" title="Undo last match (Ctrl+Z)">↩ Undo</button>
        </div>
        <div class="hon-keyboard-hints">
          <span class="hon-hint"><strong>⬅️</strong> Choose Left</span>
          <span class="hon-hint"><strong>➡️</strong> Choose Right</span>
          <span class="hon-hint"><strong>Space</strong> to Skip</span>
          <span class="hon-hint"><strong>Ctrl+Z</strong> to Undo</span>
        </div>
      </div>
    </div>`;
}

export function attachEventListeners(parent = document) {
  // 1. Stats Button — lazy import avoids circular dep with ui-stats.js
  parent.querySelector("#hon-stats-btn")?.addEventListener("click", () => {
    import('./ui-stats.js').then(m => m.openStatsModal());
  });

  // 2. Performer/image links — prevent bubbling up to the "choose" handler
  parent.querySelectorAll('.hon-performer-link, .hon-gauntlet-select-img').forEach(link => {
    link.addEventListener('click', (e) => e.stopPropagation());
  });


// 3. Skip Button
const skipBtn = parent.querySelector("#hon-skip-btn");
if (skipBtn) {
  // Logic change: Show for both swiss AND gauntlet
  const isSkippableMode = state.currentMode === 'swiss' || state.currentMode === 'gauntlet';
  skipBtn.style.display = isSkippableMode ? 'block' : 'none';

  skipBtn.onclick = () => {
    // In Gauntlet, skipping usually means loading a new opponent 
    // loadNewPair() handles the logic for both modes correctly
    if (state.currentMode === 'swiss' || state.currentMode === 'gauntlet') {
      handleSkip(); 
    }
  };
}

  // 3b. Undo Button
  const undoBtn = parent.querySelector("#hon-undo-btn");
  if (undoBtn) {
    undoBtn.onclick = () => handleUndo();
    // Show/hide based on whether there's history to undo
    undoBtn.style.display = (state.matchHistory && state.matchHistory.length > 0) ? 'inline-block' : 'none';
  }
  // 4. Gender Toggles
  parent.querySelectorAll(".hon-gender-btn").forEach(btn => {
    btn.addEventListener("click", () => handleGenderToggle(btn.dataset.gender));
  });

// 5. Mode Switches
  parent.querySelectorAll(".hon-mode-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const newMode = btn.dataset.mode;
      if (state.currentMode === newMode) return;

      state.currentMode = newMode;

      // Import the ID helper from your modal controller
      const { getPerformerIdFromUrl } = await import('./ui-modal.js');
      const urlPerformerId = getPerformerIdFromUrl();

      // Only wipe the state if we AREN'T on a performer page, 
      // or if the champion doesn't match the current page
      if (!urlPerformerId || (state.gauntletChampion && state.gauntletChampion.id.toString() !== urlPerformerId)) {
        state.gauntletChampion = null;
        state.gauntletWins = 0;
        state.gauntletDefeated = [];
        state.gauntletFalling = false;
      }

      // Re-render the UI
      const modalContent = document.querySelector(".hon-modal-content");
      if (modalContent) {
        modalContent.innerHTML = `<span class="hon-modal-close">✕</span>${createMainUI()}`;
        attachEventListeners(modalContent);
        modalContent.querySelector(".hon-modal-close").onclick = () =>
          import('./ui-modal.js').then(m => m.closeRankingModal());
      }

      // SMART REDIRECT:
      if (newMode === "gauntlet") {
        if (urlPerformerId && !state.gauntletChampion) {
          // If we are on a performer page but don't have the data yet, fetch it
          const { fetchPerformerById } = await import('./api-client.js');
          state.gauntletChampion = await fetchPerformerById(urlPerformerId);
        }

        if (state.gauntletChampion) {
          // We have a champion! Hide selection and start the match
          const selEl = document.getElementById("hon-performer-selection");
          const compEl = document.getElementById("hon-comparison-area");
          if (selEl) selEl.style.display = "none";
          if (compEl) compEl.style.display = "";
          loadNewPair();
        } else {
          // No champion found, show the selection grid
          window.showPerformerSelection();
        }
      } else {
        loadNewPair();
      }
    });
  });
}

export function handleGenderToggle(gender) {
  if (state.selectedGenders.includes(gender)) {
    state.selectedGenders = state.selectedGenders.filter(g => g !== gender);
  } else {
    state.selectedGenders.push(gender);
  }

  console.log(`[HotOrNot] Gender Filter Updated: ${state.selectedGenders.join(', ')}`);

  document.querySelectorAll(`.hon-gender-btn[data-gender="${gender}"]`).forEach(btn => {
    btn.classList.toggle("active", state.selectedGenders.includes(gender));
  });

  loadNewPair();
}

export function setMode(mode) {
  document.getElementById("hon-performer-selection").style.display = "none";
  document.getElementById("hon-comparison-area").style.display = "none";

  if (mode === 'gauntlet') {
    import('./gauntlet-selection.js').then(m => m.showPerformerSelection());
  }
}
