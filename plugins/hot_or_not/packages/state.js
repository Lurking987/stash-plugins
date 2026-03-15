/**
 * state.js
 * Global "Source of Truth" for the application.
 */

export const state = {
  // Current Matchup Info
  currentPair: { left: null, right: null },
  currentRanks: { left: null, right: null },
  
  // App Configuration & Context
  currentMode: "swiss", // "swiss", "gauntlet", or "champion"
  battleType: "performers", // "performers", "scenes", or "images"
  totalItemsCount: 0,
  disableChoice: false,
  
  // Gauntlet/Champion Mode Progress
  gauntletChampion: null,
  gauntletWins: 0,
  gauntletChampionRank: 0,
  gauntletDefeated: [],
  gauntletFalling: false,
  gauntletFallingItem: null,
  
  // Filters & Settings
  cachedUrlFilter: null,
  badgeInjectionInProgress: false,
  pluginConfigCache: null,
  selectedGenders: ["FEMALE"]
};

/**
 * Resets the gauntlet-specific progress without touching 
 * the global app settings or current matchup.
 */
export function resetBattleState() {
  state.gauntletChampion = null;
  state.gauntletWins = 0;
  state.gauntletDefeated = [];
  state.gauntletFalling = false;
  state.gauntletFallingItem = null;
  state.gauntletChampionRank = 0;
}
