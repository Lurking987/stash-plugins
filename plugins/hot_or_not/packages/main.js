import { state } from './state.js';
import * as UI from './ui-manager.js';
import { shouldShowButton } from './ui-modal.js';
import * as Gauntlet from './gauntlet-selection.js';
import * as Match from './match-handler.js';
import * as API from './api-client.js';
import { getUrlPerformerFilter } from './parsers.js'; 
import './hotornot.css';

// 1. Expose functions to window (for legacy compatibility if needed)
window.openRankingModal = UI.openRankingModal;
window.openStatsModal = UI.openStatsModal;
window.closeRankingModal = UI.closeRankingModal;
window.handleGenderToggle = UI.handleGenderToggle;
window.showPerformerSelection = Gauntlet.showPerformerSelection;
window.handleChooseItem = Match.handleChooseItem;

let lastPath = "";

// 2. Define the observer once
const observer = new MutationObserver(() => {
  const currentPath = window.location.pathname;

  // Remove floating button if we've navigated away from a valid page
  const existingBtn = document.getElementById("hon-floating-btn");
  if (existingBtn) {
    if (!shouldShowButton()) {
      existingBtn.remove();
    }
  } else if (shouldShowButton()) {
    // Re-inject if missing and we're on a valid page
    UI.addFloatingButton();
  }

  // Handle Performer Page Badge
  if (UI.isOnSinglePerformerPage()) {
    const badgeExists = !!document.getElementById("hon-battle-rank-badge");
    if (currentPath !== lastPath || !badgeExists) {
      lastPath = currentPath;
      setTimeout(() => {
        if (!document.getElementById("hon-battle-rank-badge")) {
          UI.injectBattleRankBadge();
        }
      }, 300);
    }
  }

  // Handle Main Dashboard Injection (if on the specific plugin page)
  const container = document.getElementById('stash-main-container');
  if (container && !document.getElementById('hotornot-container')) {
     container.innerHTML = UI.createMainUI();
     UI.attachEventListeners(container);
  }
});

export function main() {
  if (window.honLoaded) return;
  window.honLoaded = true;
  console.log("[HotOrNot] Global Scope Initialized");
  
  // Start observing
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Initial Check for Badge
  if (UI.isOnSinglePerformerPage()) {
    setTimeout(() => UI.injectBattleRankBadge(), 1000);
  }

  // Stash Event Listeners
  if (typeof PluginApi !== 'undefined' && PluginApi.Event?.addEventListener) {
    PluginApi.Event.addEventListener("stash:location", (e) => {
      const path = e.detail?.data?.location?.pathname || "";
      if (path.includes('/performers')) {
        state.cachedUrlFilter = getUrlPerformerFilter();
      }
    });
  }
}

main();
