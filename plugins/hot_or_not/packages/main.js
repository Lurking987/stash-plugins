import { state } from './state.js';
import { 
    addFloatingButton, 
    injectBattleRankBadge, 
    isOnSinglePerformerPage, 
    openRankingModal 
} from './ui-manager.js';
import { getUrlPerformerFilter } from './parsers.js';
import { handleChooseItem } from './match-handler.js';
import { setupKeyboardListeners } from './battle-engine.js'; // You need this!

export function main() { 
  if (window.honLoaded) return; // Prevent double initialization
  window.honLoaded = true;

  console.log("[HotOrNot] Initialized");
  
  // 1. Expose functions to Global Scope (so HTML buttons can find them)
  window.handleChooseItem = handleChooseItem;
  window.openRankingModal = openRankingModal;
  
  // 2. Initial Setup
  addFloatingButton();
  setupKeyboardListeners(); // This fixes your keyboard hint/input issue
  
  if (isOnSinglePerformerPage()) {
    setTimeout(() => injectBattleRankBadge(), 500);
  }

  // 3. SPA Navigation handling (The Mutation Observer)
  const observer = new MutationObserver(() => {
    // Only add button if it's missing
    if (!document.getElementById("hon-floating-btn")) {
        addFloatingButton();
    }
    
    // Only inject badge if on performer page and it's missing
    if (isOnSinglePerformerPage() && !document.getElementById("hon-battle-rank-badge")) {
      injectBattleRankBadge();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // 4. Stash specific location events
  if (typeof PluginApi !== 'undefined' && PluginApi.Event?.addEventListener) {
    PluginApi.Event.addEventListener("stash:location", (e) => {
      const path = e.detail?.data?.location?.pathname || "";
      if (path.includes('/performers')) {
        state.cachedUrlFilter = getUrlPerformerFilter();
      }
      if (isOnSinglePerformerPage()) {
        setTimeout(() => injectBattleRankBadge(), 500);
      }
    });
  }
}

// Start the plugin
main();
