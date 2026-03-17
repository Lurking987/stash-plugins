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

/**
 * Reads the ?c= params from the current URL and extracts any gender filter values.
 * Handles Stash's paren-encoded JSON and mixed-case display names like "Female", "Non-Binary".
 * Returns an array of ENUM strings (e.g. ["FEMALE","NON_BINARY"]) or null if no gender filter found.
 */
function parseGendersFromCurrentUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const criteriaParams = urlParams.getAll('c');
    if (!criteriaParams.length) return null;

    // Display-name → enum mapping (covers all known Stash gender labels)
    const LABEL_TO_ENUM = {
      'female':             'FEMALE',
      'male':               'MALE',
      'transgender male':   'TRANSGENDER_MALE',
      'transgender female': 'TRANSGENDER_FEMALE',
      'trans male':         'TRANSGENDER_MALE',
      'trans female':       'TRANSGENDER_FEMALE',
      'intersex':           'INTERSEX',
      'non-binary':         'NON_BINARY',
      'nonbinary':          'NON_BINARY',
      'non_binary':         'NON_BINARY',
    };

    function normalizeGender(raw) {
      const key = String(raw).toLowerCase().trim();
      // Already an enum value?
      if (Object.values(LABEL_TO_ENUM).includes(raw.toUpperCase())) return raw.toUpperCase();
      return LABEL_TO_ENUM[key] || raw.toUpperCase().replace(/[\s-]+/g, '_');
    }

    for (const param of criteriaParams) {
      // Decode and convert Stash's ( ) encoding to { }
      let raw = decodeURIComponent(param).trim();
      raw = raw.replace(/^\(/, '{').replace(/\)$/, '}');

      let criterion;
      try {
        criterion = JSON.parse(raw);
      } catch {
        continue;
      }

      if (criterion.type !== 'gender') continue;

      // value may be a single string or an array
      const val = criterion.value;
      if (!val) continue;

      const arr = Array.isArray(val) ? val : [val];
      const enums = arr.map(normalizeGender).filter(Boolean);
      if (enums.length > 0) return enums;
    }
    return null; // no gender filter in URL
  } catch (e) {
    console.warn('[HotOrNot] parseGendersFromCurrentUrl error:', e);
    return null;
  }
}

/**
 * Called whenever we land on the /performers list page.
 * Updates selectedGenders from the URL filter ONLY if a gender filter is present.
 * If no gender filter exists in the URL, leaves the current default untouched.
 */
function syncGendersFromPerformersPage() {
  const path = window.location.pathname;
  const isListPage = path === '/performers' || path === '/performers/';
  if (!isListPage) return;

  const detectedGenders = parseGendersFromCurrentUrl();
  if (detectedGenders && detectedGenders.length > 0) {
    state.selectedGenders = detectedGenders;
    console.log('[HotOrNot] Auto-synced genders from URL filter:', state.selectedGenders);
  }
  // No gender filter in URL → keep existing state.selectedGenders unchanged
}

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

  // Sync genders on initial page load if already on performers list
  syncGendersFromPerformersPage();

  // Stash Event Listeners
  if (typeof PluginApi !== 'undefined' && PluginApi.Event?.addEventListener) {
    PluginApi.Event.addEventListener("stash:location", (e) => {
      const path = e.detail?.data?.location?.pathname || "";
      if (path.includes('/performers')) {
        state.cachedUrlFilter = getUrlPerformerFilter();
      }
      // Sync gender filter whenever user navigates to the performers list page
      // (uses a small delay to let the URL settle after SPA navigation)
      const isListPage = path === '/performers' || path === '/performers/';
      if (isListPage) {
        setTimeout(syncGendersFromPerformersPage, 100);
      }
    });
  }
}

main();
