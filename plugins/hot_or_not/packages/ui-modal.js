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

  const isSpace = e.key === " " || e.code === "Space";
  const hotKeys = ["ArrowLeft", "ArrowRight", ... (isSpace ? [" ", "Space"] : [])];

  if (hotKeys.includes(e.key) || (e.code && hotKeys.includes(e.code))) {
    // Prevent scrolling when pressing space
    e.preventDefault();
    e.stopImmediatePropagation();

    if (e.key === "ArrowLeft") {
      activeModal.querySelector('.hon-scene-card[data-side="left"] .hon-scene-body')?.click();
    } else if (e.key === "ArrowRight") {
      activeModal.querySelector('.hon-scene-card[data-side="right"] .hon-scene-body')?.click();
    } else if (isSpace) {
      // Try to find the skip button - check for both standard and gauntlet IDs
      const skipBtn = document.getElementById("hon-skip-btn") || 
                      activeModal.querySelector(".hon-gauntlet-skip"); // adjust selector if gauntlet uses a class
      
      if (skipBtn) {
        skipBtn.click();
      }
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

export async function openRankingModal() {
  try {
    const path = window.location.pathname;
    const performerMatch = path.match(/\/performers\/(\d+)/);
    const isSinglePerformerPage = !!performerMatch;

    // 1. If we are on a performer page
    if (isSinglePerformerPage) {
      const performerId = performerMatch[1];
      
      // ⭐ CHECK: If a gauntlet is already running for THIS performer, just open the modal
      if (state.currentMode === "gauntlet" && 
          state.gauntletChampion && 
          state.gauntletChampion.id.toString() === performerId) {
        console.log("[HotOrNot] Resuming existing Gauntlet run.");
        _buildAndOpenModal();
        return; 
      }

      // Otherwise, initialize a NEW gauntlet run
      state.battleType = "performers";
      state.currentMode = "gauntlet";
      
      const { fetchPerformerById } = await import('./api-client.js');
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
        console.warn("[HotOrNot] Could not pre-seed performer:", e);
      }
    } else {
      // Logic for non-performer pages (Swiss Mode)
      state.battleType = path.includes('/images') ? "images" : "performers";
      state.currentMode = "swiss";
      state.gauntletChampion = null;
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
