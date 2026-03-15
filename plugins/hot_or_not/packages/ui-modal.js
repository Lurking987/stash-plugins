import { state } from './state.js';
import { loadNewPair } from './battle-engine.js';
import { createMainUI, attachEventListeners } from './ui-dashboard.js';

/**
 * ============================================
 * NAVIGATION & MODAL CONTROL
 * ============================================
 */

export function getPerformerIdFromUrl() {
  const match = window.location.pathname.match(/^\/performers\/(\d+)(?:\/|$)/);
  return match ? match[1] : null;
}

export function isOnSinglePerformerPage() {
  return getPerformerIdFromUrl() !== null;
}

export function shouldShowButton() {
  const path = window.location.pathname;

  if (path === "/performers" || path === "/performers/") return true;
  if (path === "/images" || path === "/images/") return true;

  return /^\/performers\/\d+(?:\/|$)/.test(path);
}

export function addFloatingButton() {
  const buttonId = "plugin_hon";
  const existing = document.getElementById(buttonId);

  // Remove if not needed
  if (!shouldShowButton()) {
    if (existing) existing.closest(".col-4")?.remove();
    return;
  }

  // Prevent duplicates
  if (existing) return;

  // Outer container matches other buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "col-4 col-sm-3 col-md-2 col-lg-auto nav-link";

  // Inner button styled like others
  buttonContainer.innerHTML = `
    <a href="javascript:void(0);" id="${buttonId}" class="minimal p-4 p-xl-2 d-flex d-xl-inline-block flex-column justify-content-between align-items-center btn btn-primary" title="HotOrNot">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="plugin_hon__flame">
        <path d="M8 0c-.2 3.5-2 5-3 6-1 1-1 3-1 4s1 3 3 3 4-1 4-3c0-2-2-3-2-5 0-1 1-2 1-2S9.5 0 8 0z"/>
      </svg>
      <span>HotOrNot</span>
    </a>
  `;

  // Add click behavior
  const button = buttonContainer.querySelector(`#${buttonId}`);
  button.addEventListener("click", openRankingModal);

  // Append to navbar
  const navTarget = document.querySelector(".navbar-nav");
  if (navTarget) navTarget.appendChild(buttonContainer);
}

function watchForNavigation() {
  const observer = new MutationObserver(() => {
    addFloatingButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

watchForNavigation();

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

addFloatingButton(); // initial render

const navTarget = document.querySelector(".navbar-nav");
if (navTarget) {
  const observer = new MutationObserver(() => {
    addFloatingButton();
  });

  observer.observe(navTarget, { childList: true, subtree: true });
}

// Optional: handle SPA navigation
["popstate"].forEach(event =>
  window.addEventListener(event, addFloatingButton)
  );