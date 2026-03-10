import { state } from './state.js';
import { 
    addFloatingButton, 
    injectBattleRankBadge, 
    isOnSinglePerformerPage, 
    openRankingModal, 
	openStatsModal,
	handleGenderToggle
} from './ui-manager.js';
import { getUrlPerformerFilter } from './parsers.js';
import { handleChooseItem } from './match-handler.js';

export function main() { 
  // Prevent double initialization if Stash re-injects the script
  if (window.honLoaded) return; 
  window.honLoaded = true;

  console.log("[HotOrNot] Initialized");
  
  // 1. Expose to Global Scope so HTML 'onclick' can find them
  window.handleChooseItem = handleChooseItem;
  window.openRankingModal = openRankingModal;
  window.openStatsModal = openStatsModal;
  window.handleGenderToggle = handleGenderToggle;
  
  // 2. Initial Run
  addFloatingButton();
  if (isOnSinglePerformerPage()) {
    setTimeout(() => injectBattleRankBadge(), 500);
  }

  // 3. SPA Navigation handling (Mutation Observer)
  // This ensures the floating button and rank badge appear as you click through Stash
  const observer = new MutationObserver(() => {
    if (!document.getElementById("hon-floating-btn")) {
        addFloatingButton();
    }
    
    if (isOnSinglePerformerPage() && !document.getElementById("hon-battle-rank-badge")) {
      injectBattleRankBadge();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // 4. Stash Location Events
  if (typeof PluginApi !== 'undefined' && PluginApi.Event?.addEventListener) {
    PluginApi.Event.addEventListener("stash:location", (e) => {
      const path = e.detail?.data?.location?.pathname || "";
      
      // Update filters when navigating to performer list
      if (path.includes('/performers')) {
        state.cachedUrlFilter = getUrlPerformerFilter();
      }
      
      // Re-inject badge on performer detail pages
      if (isOnSinglePerformerPage()) {
        setTimeout(() => injectBattleRankBadge(), 500);
      }
    });
  }
}

// Start the plugin logic
main();
