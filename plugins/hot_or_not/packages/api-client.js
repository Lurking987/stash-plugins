import { getPerformerFilter } from './parsers.js';
import { parsePerformerEloData, updatePerformerStats, getKFactor, isActiveParticipant, calculateMatchOutcome } from './math-utils.js';
import { state } from './state.js';

/**
 * ============================================
 * 1. CORE GRAPHQL REQUESTER
 * ============================================
 */
export async function graphqlQuery(query, variables = {}) {
  if (typeof PluginApi !== "undefined" && PluginApi.utils?.StashService?.getClient && PluginApi.libraries?.Apollo) {
    try {
      const { gql } = PluginApi.libraries.Apollo;
      const client = PluginApi.utils.StashService.getClient();
      const doc = gql(query);
      const isMutation = doc.definitions.some(def => def.kind === "OperationDefinition" && def.operation === "mutation");
      const result = isMutation
        ? await client.mutate({ mutation: doc, variables })
        : await client.query({ query: doc, variables, fetchPolicy: "no-cache" });
      return result.data;
    } catch (e) {
      console.warn("[HotOrNot] Apollo fallback to fetch:", e.message);
    }
  }

  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  
  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
}

/**
 * ============================================
 * 2. FRAGMENTS
 * ============================================
 */
export const SCENE_FRAGMENT = `id title date rating100 paths { screenshot preview } files { duration path } studio { name } performers { name } tags { name }`;
export const PERFORMER_FRAGMENT = `id name image_path rating100 details custom_fields birthdate ethnicity country gender`;
export const IMAGE_FRAGMENT = `id rating100 paths { thumbnail image }`;

/**
 * ============================================
 * 3. FETCHING LOGIC (Scenes, Performers, Images)
 * ============================================
 */
export async function fetchSceneCount() {
  const result = await graphqlQuery(`query { findScenes(filter: { per_page: 0 }) { count } }`);
  return result.findScenes.count;
}

export async function fetchRandomScenes(count = 2) {
  const total = await fetchSceneCount();
  const result = await graphqlQuery(`query($f: FindFilterType) { findScenes(filter: $f) { scenes { ${SCENE_FRAGMENT} } } }`, {
    f: { per_page: Math.min(100, total), sort: "random" }
  });
  return (result.findScenes.scenes || []).sort(() => Math.random() - 0.5).slice(0, count);
}

export async function fetchPerformerById(id) {
  const result = await graphqlQuery(`query($id: ID!) { findPerformer(id: $id) { ${PERFORMER_FRAGMENT} } }`, { id });
  return result.findPerformer;
}

export async function fetchPerformerCount(filter = {}) {
  const result = await graphqlQuery(`query($f: PerformerFilterType) { findPerformers(performer_filter: $f, filter: { per_page: 0 }) { count } }`, { f: filter });
  return result.findPerformers.count;
}

export async function fetchRandomImages(count = 2) {
  const totalImages = await fetchImageCount();
  if (totalImages < 2) {
    throw new Error("Not enough images for comparison. You need at least 2 images.");
  }

  const imagesQuery = `
    query FindRandomImages($filter: FindFilterType) {
      findImages(filter: $filter) {
        images {
          ${IMAGE_FRAGMENT}
        }
      }
    }
  `;

  const result = await graphqlQuery(imagesQuery, {
    filter: {
      per_page: Math.min(100, totalImages),
      sort: "random"
    }
  });

  const allImages = result.findImages.images || [];
    
  if (allImages.length < 2) {
    throw new Error("Not enough images returned from query.");
  }

  const shuffled = allImages.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

export async function handleComparison(winnerId, loserId, winnerCurrentRating, loserCurrentRating, loserRank = null, winnerObj = null, loserObj = null, isDraw = false) {
    const winnerRating = winnerCurrentRating || 50;
    const loserRating = loserCurrentRating || 50;

    let freshWinnerObj = winnerObj;
    let freshLoserObj = loserObj;
    
    // 1. Fetch Fresh Data (if performers)
    if (state.battleType === "performers") {
      const [fetchedWinner, fetchedLoser] = await Promise.all([
        (winnerId) ? fetchPerformerById(winnerId) : Promise.resolve(null),
        (loserId) ? fetchPerformerById(loserId) : Promise.resolve(null)
      ]);
      freshWinnerObj = fetchedWinner || winnerObj;
      freshLoserObj = fetchedLoser || loserObj;
    }
    
    // 2. Get Match Counts for K-Factor
    let winnerMatchCount = 0;
    let loserMatchCount = 0;
    if (state.battleType === "performers") {
      winnerMatchCount = parsePerformerEloData(freshWinnerObj)?.total_matches || 0;
      loserMatchCount = parsePerformerEloData(freshLoserObj)?.total_matches || 0;
    }
    
    let winnerGain = 0;
    let loserLoss = 0;

    // 3. ELO CALCULATIONS
    if (isDraw) {
      // Draw: symmetric adjustment toward expected score
      const ratingDiff2 = loserRating - winnerRating;
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff2 / 400));
      const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
      const loserK  = getKFactor(loserRating,  loserMatchCount,  "swiss");
      winnerGain = Math.round(winnerK * (0.5 - expectedWinner));
      loserLoss  = Math.round(loserK  * ((1 - expectedWinner) - 0.5));
    } else {
      const isChampionWinner = !!state.gauntletChampion && winnerId === state.gauntletChampion.id;
      const isFallingWinner  = state.gauntletFalling && !!state.gauntletFallingItem && winnerId === state.gauntletFallingItem.id;
      const isChampionLoser  = !!state.gauntletChampion && loserId  === state.gauntletChampion.id;
      const isFallingLoser   = state.gauntletFalling && !!state.gauntletFallingItem && loserId  === state.gauntletFallingItem.id;

      ({ winnerGain, loserLoss } = calculateMatchOutcome({
        winnerRating, loserRating,
        mode: state.currentMode,
        winnerMatchCount, loserMatchCount,
        isChampionWinner, isFallingWinner,
        isChampionLoser,  isFallingLoser,
        loserRank
      }));
    }
    
    // 4. Finalize Ratings
    const newWinnerRating = Math.min(100, Math.max(1, winnerRating + winnerGain));
    const newLoserRating = Math.min(100, Math.max(1, loserRating - loserLoss));
    
// 5. Determine if we should update full stats or just the Rating
const isFirstMatchGlobal = (state.currentMode === "gauntlet" || state.currentMode === "champion") && !state.gauntletChampion;

// For gauntlet/champion modes, ALWAYS track both participants
const shouldTrackWinner = state.battleType === "performers" && (
    state.currentMode === "gauntlet" || 
    state.currentMode === "champion" || 
    isActiveParticipant(winnerId, state.currentMode, state.gauntletChampion, state.gauntletFallingItem) || 
    isFirstMatchGlobal
);

const shouldTrackLoser = state.battleType === "performers" && (
    state.currentMode === "gauntlet" || 
    state.currentMode === "champion" || 
    isActiveParticipant(loserId, state.currentMode, state.gauntletChampion, state.gauntletFallingItem) || 
    isFirstMatchGlobal
);
    
    // Winner Status: true = win, false = loss, null = draw
    const winnerStatus = isDraw ? null : true;
    const loserStatus = isDraw ? null : false;

	// 5b. Save undo snapshot BEFORE writing to DB
	// We capture a full snapshot of the stats AND the record list
	const winnerOldStats = (shouldTrackWinner && freshWinnerObj) ? {
		...parsePerformerEloData(freshWinnerObj),
		performer_record: freshWinnerObj.custom_fields?.performer_record 
	} : null;

	const loserOldStats = (shouldTrackLoser && freshLoserObj) ? {
		...parsePerformerEloData(freshLoserObj),
		performer_record: freshLoserObj.custom_fields?.performer_record 
	} : null;

	if (!state.matchHistory) state.matchHistory = [];
	state.matchHistory.push({
		winnerId,
		loserId,
		winnerOldRating: winnerRating,
		loserOldRating:  loserRating,
		winnerOldStats, // This now contains the record list!
		loserOldStats,  // This now contains the record list!
		pairSnapshot: {
			left:  state.currentPair.left  ? { ...state.currentPair.left }  : null,
			right: state.currentPair.right ? { ...state.currentPair.right } : null,
			rankLeft:  state.currentRanks.left,
			rankRight: state.currentRanks.right,
		},
		gauntletSnapshot: {
			gauntletChampion:    state.gauntletChampion    ? { ...state.gauntletChampion } : null,
			gauntletWins:        state.gauntletWins,
			gauntletDefeated:    [...(state.gauntletDefeated || [])],
			gauntletFalling:     state.gauntletFalling,
			gauntletFallingItem: state.gauntletFallingItem ? { ...state.gauntletFallingItem } : null,
		}
	});
    // Keep history bounded to last 10 matches
    if (state.matchHistory.length > 10) state.matchHistory.shift();


	// 6. SINGLE SOURCE OF TRUTH: Update Database
	// Update Winner (Opponent is loserId)
	if (!winnerId || !loserId) {
			console.error("[HotOrNot] Cannot update rating: One or both IDs are missing", { winnerId, loserId });
			return { newWinnerRating, newLoserRating, winnerChange: winnerGain, loserChange: -loserLoss };
		}

    // 7. SINGLE SOURCE OF TRUTH: Update Database

await updateItemRating(
    winnerId, 
    newWinnerRating, 
    shouldTrackWinner ? freshWinnerObj : null, 
    winnerStatus, 
    loserId  // Pass the ID instead of the potentially null object
);

// Update Loser (passing freshWinnerObj as the opponent object)
await updateItemRating(
    loserId, 
    newLoserRating, 
    shouldTrackLoser ? freshLoserObj : null, 
    loserStatus, 
    winnerId  // Pass the ID instead of the potentially null object
);
    return { 
        newWinnerRating, 
        newLoserRating, 
        winnerChange: winnerGain, 
        loserChange: -loserLoss 
    };
}
  
export async function updateItemRating(itemId, newRating, itemObj = null, won = null, opponentId = null) {
    if (state.battleType === "performers") {
        // Pass opponentId through!
        return await updatePerformerRating(itemId, newRating, itemObj, won, opponentId);
    } else if (state.battleType === "images") {
        return await updateImageRating(itemId, newRating);
    } else {
        return await updateSceneRating(itemId, newRating);
    }
}
export async function fetchRandomPerformers(count = 2) {
  // Use state.selectedGenders, NEVER just selectedGenders
  if (state.selectedGenders.length === 0) {
    throw new Error("No genders selected.");
  }
  
  const battleGender = state.selectedGenders[Math.floor(Math.random() * state.selectedGenders.length)];
  
  // We wrap battleGender in an array [battleGender] because the parser expects a list
  const performerFilter = getPerformerFilter(state.cachedUrlFilter, [battleGender]);
  
  const totalPerformers = await fetchPerformerCount(performerFilter);
  if (totalPerformers < 2) {
    throw new Error("Not enough performers matching the selected gender.");
  }

  const performerQuery = `
    query FindRandomPerformers($performer_filter: PerformerFilterType, $filter: FindFilterType) {
      findPerformers(performer_filter: $performer_filter, filter: $filter) {
        performers {
          ${PERFORMER_FRAGMENT}
        }
      }
    }
  `;

  const result = await graphqlQuery(performerQuery, {
    performer_filter: performerFilter,
    filter: {
      per_page: Math.min(100, totalPerformers),
      sort: "random"
    }
  });

  const allPerformers = result?.findPerformers?.performers || [];
  
  if (allPerformers.length < 2) {
    throw new Error("Not enough performers for comparison.");
  }

  const shuffled = [...allPerformers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}


export async function fetchImageCount() {
    const countQuery = `
      query FindImages {
        findImages(filter: { per_page: 0 }) {
          count
        }
      }
    `;
    const countResult = await graphqlQuery(countQuery);
    return countResult.findImages.count;
}
  
/**
 * Fetches all performers who have a rating to generate the stats dashboard
 */
 
export async function fetchAllPerformerStats() {
  const result = await graphqlQuery(`
    query FindAllPerformers($filter: FindFilterType) {
      findPerformers(filter: $filter) {
        performers { ${PERFORMER_FRAGMENT} }
      }
    }
  `, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });
  
  const performers = result.findPerformers.performers || [];
  return performers.sort((a, b) => (b.rating100 ?? 50) - (a.rating100 ?? 50));
}
  
/**
 * ============================================
 * 4. MUTATION LOGIC
 * ============================================
 */
export async function updateSceneRating(id, rating) {
  await graphqlQuery(`mutation($i: SceneUpdateInput!) { sceneUpdate(input: $i) { id } }`, {
    i: { id, rating100: Math.max(1, Math.min(100, rating)) }
  });
}

export async function updateImageRating(id, rating) {
  await graphqlQuery(`mutation($i: ImageUpdateInput!) { imageUpdate(input: $i) { id } }`, {
    i: { id, rating100: Math.max(1, Math.min(100, rating)) }
  });
}

export async function updatePerformerRating(id, rating, performerObj = null, won = null, opponentId = null) {
  const variables = { id, rating: Math.round(rating), fields: {} };
  
  if (performerObj) {
    // 1. Update Numerical Stats
    const currentStats = parsePerformerEloData(performerObj);
    const updatedStats = updatePerformerStats(currentStats, won);
    variables.fields.hotornot_stats = JSON.stringify(updatedStats);

    // 2. Handle Match History
    let matchHistory = [];
    try {
      const rawRecord = performerObj.custom_fields?.performer_record;
      if (rawRecord) {
        matchHistory = typeof rawRecord === 'string' ? JSON.parse(rawRecord) : rawRecord;
      }
    } catch (e) {
      matchHistory = [];
    }

    // Handle opponent data - robust logic that works with IDs or objects
    let opponentData = "0:Unknown";
    if (opponentId) {
      // If opponentId is already in "ID:Name" format, use it directly
      if (typeof opponentId === 'string' && opponentId.includes(':')) {
        opponentData = opponentId;
      }
      // If opponentId is a simple ID or string ID
      else if (typeof opponentId === 'string' || typeof opponentId === 'number') {
        let cleanId = opponentId.toString().replace(/^.*?(\d+).*$/, '$1'); // Extract digits
        if (cleanId && cleanId !== '0') {
          // First, try to get name from current state context
          let opponentName = "Unknown";
          
          // Check if this ID matches someone in the current pair
          if (state.currentPair) {
            if (state.currentPair.left && state.currentPair.left.id == cleanId) {
              opponentName = state.currentPair.left.name || `Performer #${cleanId}`;
            } else if (state.currentPair.right && state.currentPair.right.id == cleanId) {
              opponentName = state.currentPair.right.name || `Performer #${cleanId}`;
            }
          }
          
          // Check if this ID matches the champion
          if (opponentName === "Unknown" && state.gauntletChampion && state.gauntletChampion.id == cleanId) {
            opponentName = state.gauntletChampion.name || `Performer #${cleanId}`;
          }
          
          // If still unknown, try to fetch from database
          if (opponentName === "Unknown") {
            try {
              const opponentPerformer = await fetchPerformerById(cleanId);
              if (opponentPerformer) {
                opponentName = opponentPerformer.name || `Performer #${cleanId}`;
              }
            } catch (e) {
              console.warn(`[HotOrNot] Failed to fetch opponent ${cleanId}:`, e);
            }
          }
          
          opponentData = `${cleanId}:${opponentName}`;
        }
      }
      // If opponentId is an object
      else if (typeof opponentId === 'object') {
        const oppId = opponentId.id || "0";
        let oppName = opponentId.name || "Unknown";
        
        // If name is still unknown, try to get it from state
        if (oppName === "Unknown") {
          if (state.currentPair) {
            if (opponentId === state.currentPair.left) {
              oppName = state.currentPair.left.name || `Performer #${oppId}`;
            } else if (opponentId === state.currentPair.right) {
              oppName = state.currentPair.right.name || `Performer #${oppId}`;
            }
          }
          if (oppName === "Unknown" && state.gauntletChampion && opponentId === state.gauntletChampion) {
            oppName = state.gauntletChampion.name || `Performer #${oppId}`;
          }
        }
        
        // If still unknown, fetch from database
        if (oppName === "Unknown" && oppId && oppId !== "0") {
          try {
            const opponentPerformer = await fetchPerformerById(oppId);
            if (opponentPerformer) {
              oppName = opponentPerformer.name || `Performer #${oppId}`;
            }
          } catch (e) {
            console.warn(`[HotOrNot] Failed to fetch opponent ${oppId}:`, e);
          }
        }
        
        if (oppId && oppId !== "0") {
          opponentData = `${oppId}:${oppName}`;
        }
      }
    }

    matchHistory.push({
      date: new Date().toISOString(),
      opponent: opponentData,
      won: won,
      ratingAfter: Math.round(rating)
    });

    // Keep history lean to avoid character limits
    if (matchHistory.length > 30) matchHistory = matchHistory.slice(-30);
    variables.fields.performer_record = JSON.stringify(matchHistory);
  }

  await graphqlQuery(`
    mutation($id: ID!, $rating: Int!, $fields: Map) {
      performerUpdate(input: { 
        id: $id, 
        rating100: $rating, 
        custom_fields: { partial: $fields } 
      }) { 
        id 
      }
    }`, variables);
}



/**
 * ============================================
 * 5. UNDO LAST MATCH
 * ============================================
 */
/**
 * Reverses the most recent match by restoring pre-match ratings and stats.
 * Returns the saved pairSnapshot so the caller can re-render it directly,
 * or null if nothing to undo.
 */
export async function undoLastMatch() {
  if (!state.matchHistory || state.matchHistory.length === 0) return null;

  const last = state.matchHistory.pop();

  // 1. Restore DB ratings/stats using the snapshots we already have
  // We pass the old stats directly so we don't have to fetch them again
  await updateItemRatingDirect(last.winnerId, last.winnerOldRating, last.winnerOldStats);
  await updateItemRatingDirect(last.loserId,  last.loserOldRating,  last.loserOldStats);

  // 2. Restore gauntlet/champion state
  if (last.gauntletSnapshot) {
    const snap = last.gauntletSnapshot;
    state.gauntletChampion    = snap.gauntletChampion;
    state.gauntletWins        = snap.gauntletWins;
    state.gauntletDefeated    = [...snap.gauntletDefeated];
    state.gauntletFalling     = snap.gauntletFalling;
    state.gauntletFallingItem = snap.gauntletFallingItem;
  }

  // 3. Restore in-memory ratings for immediate UI feedback
  if (last.pairSnapshot) {
    const { left, right } = last.pairSnapshot;
    state.currentPair  = { left, right };
    state.currentRanks = { left: last.pairSnapshot.rankLeft, right: last.pairSnapshot.rankRight };
  }

  return last.pairSnapshot || null;
}

/**
 * Writes a pre-computed rating and stats snapshot straight to the DB (used by undo).
 * Bypasses ELO recalculation entirely.
 */

async function updateItemRatingDirect(itemId, rating, statsObj) {
  if (state.battleType === "performers") {
    const fields = {};

    if (statsObj) {
      // 1. Restore the numerical Elo stats
      fields.hotornot_stats = JSON.stringify(statsObj);
      
      // 2. Restore the match history list (performer_record)
      if (statsObj.performer_record) {
        fields.performer_record = typeof statsObj.performer_record === 'string' 
          ? statsObj.performer_record 
          : JSON.stringify(statsObj.performer_record);
      }
    }

    await graphqlQuery(`
      mutation($id: ID!, $rating: Int!, $fields: Map) {
        performerUpdate(input: { 
          id: $id, 
          rating100: $rating, 
          custom_fields: { partial: $fields } 
        }) { 
          id 
        }
      }`, { 
        id: itemId, 
        rating: Math.round(rating), 
        fields 
      });

  } else if (state.battleType === "images") {
    await updateImageRating(itemId, rating);
  } else {
    await updateSceneRating(itemId, rating);
  }
}

/**
 * ============================================
 * 6. CONFIGURATION SERVICES
 * ============================================
 */
let pluginConfigCache = null;
export async function getHotOrNotConfig() {
  if (pluginConfigCache) return pluginConfigCache;
  const result = await graphqlQuery(`query { configuration { plugins } }`);
  pluginConfigCache = (result.configuration.plugins || {})["HotOrNot"] || {};
  return pluginConfigCache;
}

export async function isBattleRankBadgeEnabled() {
  const config = await getHotOrNotConfig();
  return config.showBattleRankBadge !== false;
}


/**
 * ============================================
 * 7. CALCULATE RANK LOCALLY
 * ============================================
 */
export async function getPerformerBattleRank(performerId) {
  try {
    // 1. Get the target performer's rating first
    const target = await fetchPerformerById(performerId);
    if (!target || target.rating100 === null) return null;

    const currentRating = target.rating100;

    // 2. Count how many performers are rated higher
    // We use a filter to only fetch the count of performers with rating > currentRating
    const rankResult = await graphqlQuery(`
      query GetRankCount($rating: Int!) {
        findPerformers(performer_filter: { rating100: { value: $rating, modifier: GREATER_THAN } }) {
          count
        }
        totalRated: findPerformers(performer_filter: { rating100: { value: 0, modifier: GREATER_THAN } }) {
          count
        }
      }
    `, { rating: currentRating });

    const rank = (rankResult.findPerformers.count || 0) + 1;
    const total = rankResult.totalRated.count || 0;

    // Parse stats from the target we already fetched
    let stats = null;
    const statsJson = target.custom_fields?.["hotornot_stats"];
    if (statsJson) {
      stats = typeof statsJson === 'string' ? JSON.parse(statsJson) : statsJson;
    }

    return { rank, total, rating: currentRating, stats };
  } catch (err) {
    console.error("[HotOrNot] Error calculating rank:", err);
    return null;
  }
}