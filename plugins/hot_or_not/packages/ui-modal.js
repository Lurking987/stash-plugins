import { state } from './state.js';
import { loadNewPair } from './battle-engine.js';
import { createMainUI, attachEventListeners } from './ui-dashboard.js';

/**
 * ============================================
 * NAVIGATION & MODAL CONTROL
 * ============================================
 */

export function shouldShowButton() {
  const path = window.location.pathname;
  return /^\/performers/.test(path) || /^\/images/.test(path);
}

export function addFloatingButton() {
  if (document.getElementById("hon-floating-btn")) return;
  if (!shouldShowButton()) return;

  const btn = document.createElement("button");
  btn.id = "hon-floating-btn";
  btn.innerHTML = "🔥";
  btn.onclick = () => window.openRankingModal();
  btn.setAttribute("onclick", "window.openRankingModal()");
  document.body.appendChild(btn);
}

// Declared outside so closeRankingModal can remove the same reference
function handleGlobalKeys(e) {
  const activeModal = document.getElementById("hon-modal");
  if (!activeModal) {
    document.removeEventListener("keydown", handleGlobalKeys);
    return;
  }

  const hotKeys = ["ArrowLeft", "ArrowRight", " ", "Space"];
  if (hotKeys.includes(e.key) || hotKeys.includes(e.code)) {
    e.stopImmediatePropagation();
    e.preventDefault();

    if (e.key === "ArrowLeft") {
      const leftCard = activeModal.querySelector('.hon-scene-card[data-side="left"]');
      leftCard?.querySelector('.hon-scene-body')?.click();
    }
    if (e.key === "ArrowRight") {
      const rightCard = activeModal.querySelector('.hon-scene-card[data-side="right"]');
      rightCard?.querySelector('.hon-scene-body')?.click();
    }
    if (e.key === " " || e.code === "Space") {
      document.getElementById("hon-skip-btn")?.click();
    }
  }
}

function _buildAndOpenModal() {
  try {
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

    modal.querySelector(".hon-modal-close").onclick = () => closeRankingModal();
    modal.querySelector(".hon-modal-backdrop").onclick = () => closeRankingModal();

    attachEventListeners(modal);

    if (state.currentMode === "gauntlet") {
      // If champion already seeded (from performer page), skip selection screen
      if (state.gauntletChampion) {
        const selEl = document.getElementById("hon-performer-selection");
        const compEl = document.getElementById("hon-comparison-area");
        const actEl = document.querySelector(".hon-actions");
        if (selEl) selEl.style.display = "none";
        if (compEl) compEl.style.display = "";
        if (actEl) actEl.style.display = "";
        loadNewPair();
      } else {
        window.showPerformerSelection();
      }
    } else {
      loadNewPair();
    }

    document.addEventListener("keydown", handleGlobalKeys);
  } catch (err) {
    console.error("CRASH in _buildAndOpenModal:", err);
  }
}

export function openRankingModal() {
  try {
    const path = window.location.pathname;
    state.battleType = path.includes('/images') ? "images" : "performers";

    // If on a single performer page in Gauntlet mode, pre-seed that performer as champion
    const performerMatch = path.match(/\/performers\/(\d+)/);
    if (performerMatch && state.currentMode === "gauntlet") {
      const performerId = performerMatch[1];
      import('./api-client.js').then(async ({ fetchPerformerById }) => {
        try {
          const performer = await fetchPerformerById(performerId);
          if (performer) {
            state.gauntletChampion = performer;
            state.gauntletWins = 0;
            state.gauntletDefeated = [];
            state.gauntletFalling = false;
            state.gauntletFallingItem = null;
          }
        } catch (e) {
          console.warn("[HotOrNot] Could not pre-seed performer for gauntlet:", e);
        }
        _buildAndOpenModal();
      });
      return;
    }

    _buildAndOpenModal();
  } catch (err) {
    console.error("CRASH in openRankingModal:", err);
  }
}

export function closeRankingModal() {
  const gameModal = document.getElementById("hon-modal");
  const statsModal = document.getElementById("hon-stats-modal");

  if (gameModal) gameModal.remove();
  if (statsModal) statsModal.remove();

  document.removeEventListener("keydown", handleGlobalKeys);
}
