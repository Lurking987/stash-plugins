/**
 * MATH & RATING UTILITIES
 * Pure functions for Elo, Weighting, and Stats
 */

/**
 * Calculates how likely a performer is to be picked based on time since last match
 */
export function getRecencyWeight(performer) {
  const stats = parsePerformerEloData(performer);
  if (!stats.last_match) return 1.0;

  const hoursSince = (Date.now() - new Date(stats.last_match).getTime()) / (1000 * 60 * 60);
  
  if (hoursSince < 1) return 0.1;
  if (hoursSince < 6) return 0.3;
  if (hoursSince < 24) return 0.6;
  return 1.0;
}

/**
 * Standard Weighted Random Selection algorithm
 */
export function weightedRandomSelect(items, weights) {
  if (!items?.length || items.length !== weights?.length) return null;
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) return items[Math.floor(Math.random() * items.length)];
  
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Matchmaking: Select a random opponent from the closest remaining options
 */
export function selectRandomOpponent(remainingOpponents, maxChoices = 3) {
  if (remainingOpponents.length === 0) return null;
  const closestOpponents = remainingOpponents.slice(-maxChoices);
  return closestOpponents[Math.floor(Math.random() * closestOpponents.length)];
}

/**
 * Stats: Parse ELO match data from performer custom_fields
 */
export function parsePerformerEloData(performer) {
  const defaultStats = {
    total_matches: 0, wins: 0, losses: 0, draws: 0,
    current_streak: 0, best_streak: 0, worst_streak: 0, last_match: null
  };

  if (!performer?.custom_fields) return defaultStats;

  if (performer.custom_fields.hotornot_stats) {
    try {
      const stats = JSON.parse(performer.custom_fields.hotornot_stats);
      return { ...defaultStats, ...stats };
    } catch (e) {
      console.warn(`[HotOrNot] Failed to parse stats for ${performer.id}`);
    }
  }

  const eloMatches = parseInt(performer.custom_fields.elo_matches, 10);
  if (!isNaN(eloMatches)) return { ...defaultStats, total_matches: eloMatches };

  return defaultStats;
}

/**
 * Stats: Update the stats object based on match outcome
 */
export function updatePerformerStats(currentStats, won) {
  const newStats = {
    ...currentStats,
    total_matches: currentStats.total_matches + 1,
    last_match: new Date().toISOString()
  };

  if (won === null) return newStats;

  newStats.wins = won ? currentStats.wins + 1 : currentStats.wins;
  newStats.losses = won ? currentStats.losses : currentStats.losses + 1;
  newStats.current_streak = won 
    ? (currentStats.current_streak >= 0 ? currentStats.current_streak + 1 : 1)
    : (currentStats.current_streak <= 0 ? currentStats.current_streak - 1 : -1);

  newStats.best_streak = Math.max(currentStats.best_streak, newStats.current_streak);
  newStats.worst_streak = Math.min(currentStats.worst_streak, newStats.current_streak);

  return newStats;
}

/**
 * Rating: Calculate K-factor based on match count and mode
 */
export function getKFactor(currentRating, matchCount = null, mode = "swiss") {
  let baseK;
  if (matchCount !== null) {
    baseK = matchCount < 10 ? 16 : (matchCount < 30 ? 12 : 8);
  } else {
    const dist = Math.abs(currentRating - 50);
    baseK = dist < 10 ? 12 : (dist < 25 ? 10 : 8);
  }
  return mode === "champion" ? Math.max(1, Math.round(baseK * 0.5)) : baseK;
}

/**
 * Logic: Determine if a performer is an active participant in the current mode
 */
export function isActiveParticipant(performerId, mode, gauntletChampion, gauntletFallingItem) {
  if (mode === "swiss" || mode === "champion") return true;
  if (mode === "gauntlet") {
    return performerId === gauntletChampion?.id || performerId === gauntletFallingItem?.id;
  }
  return false;
}

/**
 * Rating: Calculate new rating gains/losses
 */
export function calculateMatchOutcome({
  winnerRating,
  loserRating,
  mode,
  winnerMatchCount,
  loserMatchCount,
  isChampionWinner,
  isFallingWinner,
  isChampionLoser,
  isFallingLoser,
  loserRank
}) {
  const ratingDiff = loserRating - winnerRating;
  const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 400));
  
  let winnerGain = 0;
  let loserLoss = 0;

  if (mode === "gauntlet") {
    const kFactor = getKFactor(winnerRating, winnerMatchCount, "gauntlet");
    if (isChampionWinner || isFallingWinner) {
      winnerGain = Math.max(0, Math.round(kFactor * (1 - expectedWinner)));
    }
    if (isChampionLoser || isFallingLoser) {
      loserLoss = Math.max(0, Math.round(kFactor * expectedWinner));
    }
    if (loserRank === 1 && !isChampionLoser && !isFallingLoser) {
      loserLoss = 1;
    }
  } else {
    const winnerK = getKFactor(winnerRating, winnerMatchCount, mode);
    const loserK = getKFactor(loserRating, loserMatchCount, mode);
    winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
    loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
  }

  return { winnerGain, loserLoss };
}
