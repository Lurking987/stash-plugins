import { state } from './state.js';
import { loadNewPair } from './battle-engine.js';
import { createMainUI, attachEventListeners } from './ui-dashboard.js';

/**
 * ============================================
 * NAVIGATION & MODAL CONTROL
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
  btn.onclick = () => window.openRankingModal();
  btn.setAttribute("onclick", "window.openRankingModal()");
  document.body.appendChild(btn);
}

// Declared outside so closeRankingModal can remove the same reference
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

    modal.querySelector(".hon-modal-close").onclick = () => closeRankingModal();
    modal.querySelector(".hon-modal-backdrop").onclick = () => closeRankingModal();

    attachEventListeners(modal);

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
  if (statsModal) statsModal.remove();

  document.removeEventListener("keydown", handleGlobalKeys);
}
