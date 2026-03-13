import { state } from './state.js';
import { ALL_GENDERS } from './constants.js';
import { loadNewPair } from './battle-engine.js';
import { handleSkip } from './match-handler.js';

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
    skipBtn.style.display = (state.currentMode === 'swiss') ? 'block' : 'none';
    skipBtn.onclick = () => {
      if (state.currentMode === 'swiss') handleSkip();
    };
  }

  // 4. Gender Toggles
  parent.querySelectorAll(".hon-gender-btn").forEach(btn => {
    btn.addEventListener("click", () => handleGenderToggle(btn.dataset.gender));
  });

  // 5. Mode Switches
  parent.querySelectorAll(".hon-mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const newMode = btn.dataset.mode;
      if (state.currentMode === newMode) return;

      state.currentMode = newMode;
      state.gauntletChampion = null;
      state.gauntletFalling = false;
      state.gauntletWins = 0;
      state.gauntletDefeated = [];

      // Re-render whichever container is active
      const modalContent = document.querySelector(".hon-modal-content");
      const mainContainer = document.getElementById('stash-main-container');

      if (modalContent) {
        modalContent.innerHTML = `<span class="hon-modal-close">✕</span>${createMainUI()}`;
        attachEventListeners(modalContent);
        // Lazy import to avoid circular dep: ui-dashboard -> ui-modal -> ui-dashboard
        modalContent.querySelector(".hon-modal-close").onclick = () =>
          import('./ui-modal.js').then(m => m.closeRankingModal());
      } else if (mainContainer) {
        mainContainer.innerHTML = createMainUI();
        attachEventListeners(mainContainer);
      }

      if (newMode === "gauntlet") {
        window.showPerformerSelection();
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
