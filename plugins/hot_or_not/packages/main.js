import { state } from './state.js';
import * as UI from './ui-manager.js';
import * as Gauntlet from './gauntlet-selection.js';
import * as Match from './match-handler.js';
import * as API from './api-client.js';
import { getUrlPerformerFilter } from './parsers.js'; 
import './hotornot.css';

window.openRankingModal = UI.openRankingModal;
window.openStatsModal = UI.openStatsModal;
window.closeRankingModal = UI.closeRankingModal;
window.handleGenderToggle = UI.handleGenderToggle;
window.showPerformerSelection = Gauntlet.showPerformerSelection;
window.handleChooseItem = Match.handleChooseItem;

export function main() {
  if (window.honLoaded) return;
  window.honLoaded = true;
  console.log("[HotOrNot] Global Scope Initialized");
  
  UI.addFloatingButton();
  
  // Use the UI namespace for these calls too!
  if (UI.isOnSinglePerformerPage()) {
    setTimeout(() => UI.injectBattleRankBadge(), 1000);
  }

  const observer = new MutationObserver(() => {
    if (!document.getElementById("hon-floating-btn")) {
        UI.addFloatingButton();
    }
    if (UI.isOnSinglePerformerPage() && !document.getElementById("hon-battle-rank-badge")) {
      UI.injectBattleRankBadge();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  if (typeof PluginApi !== 'undefined' && PluginApi.Event?.addEventListener) {
    PluginApi.Event.addEventListener("stash:location", (e) => {
      const path = e.detail?.data?.location?.pathname || "";
      if (path.includes('/performers')) {
        state.cachedUrlFilter = getUrlPerformerFilter();
      }
      if (UI.isOnSinglePerformerPage()) {
        setTimeout(() => UI.injectBattleRankBadge(), 1000);
      }
    });
  }
}

main();
