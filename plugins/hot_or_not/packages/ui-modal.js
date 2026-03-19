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

  // Inner button styled exactly like the Performers button
  buttonContainer.innerHTML = `
    <a href="javascript:void(0);" id="${buttonId}" class="minimal p-4 p-xl-2 d-flex d-xl-inline-block flex-column justify-content-between align-items-center btn btn-primary" title="HotOrNot">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 16 16" 
        class="plugin_hon__flame svg-inline--fa fa-icon nav-menu-icon d-block d-xl-inline mb-2 mb-xl-0" 
        fill="currentColor"
        aria-hidden="true" 
        focusable="false" 
        role="img">
        <path d="M15.81 9l-2.47-4.93 0.83-0.15c0.239-0.044 0.418-0.251 0.418-0.5 0-0.281-0.227-0.508-0.508-0.508-0.032 0-0.063 0.003-0.093 0.009l-0.777 0.14c-0.993-0.755-2.25-1.21-3.613-1.21-0.21 0-0.418 0.011-0.623 0.032-0.036-0.5-0.457-0.882-0.967-0.882-0.003 0-0.005 0-0.008 0-0.552 0-1 0.448-1 1v0.2c-1.714 0.336-3.151 1.327-4.066 2.697l-0.754 0.153c-0.257 0.024-0.457 0.239-0.457 0.5 0 0.277 0.225 0.502 0.502 0.502 0.016 0 0.032-0.001 0.047-0.002l0.088 0 0.35-0.050-2.52 5h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19l-2.56-5.12h0.1c0.172-0.031 0.311-0.144 0.379-0.297 0.021-0.093 0.701-1.583 3.271-2.363v10.78h-1v1h-2v1h8v-1h-2v-1h-1v-11.12c0.201-0.031 0.434-0.049 0.67-0.049 1.152 0 2.205 0.419 3.016 1.114l-0.006-0.005-2.49 5.060h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19zM5 11h-4l2-3.94zM11 9l2-3.94 2 3.94h-4z"/>
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
  
   if (e.key === "Escape" || e.key === "Esc") {
    e.preventDefault();
    e.stopImmediatePropagation();
    closeRankingModal();
    return;
  }

  // Ctrl+Z — Undo last match
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    e.stopImmediatePropagation();
    import('./match-handler.js').then(m => m.handleUndo());
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

    document.addEventListener("keydown", handleGlobalKeys, { capture: true });
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
      // Gender filter is synced from URL in main.js syncGendersFromPerformersPage()
      // when the user navigates to /performers — no action needed here.
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

  document.removeEventListener("keydown", handleGlobalKeys, { capture: true });
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