import { getPerformerFilter } from './parsers.js';
import { parsePerformerEloData, updatePerformerStats, getKFactor, isActiveParticipant } from './math-utils.js';
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

// ... include your fetchRandomPerformers, fetchImageCount, and fetchRandomImages here
export async function handleComparison(winnerId, loserId, winnerCurrentRating, loserCurrentRating, loserRank = null, winnerObj = null, loserObj = null, isDraw = false) {
    const winnerRating = winnerCurrentRating || 50;
    const loserRating = loserCurrentRating || 50;
    const ratingDiff = loserRating - winnerRating;
    
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
      // --- DRAW LOGIC (Swiss Only) ---
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 400));
      const expectedLoser = 1 - expectedWinner;
      const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
      const loserK = getKFactor(loserRating, loserMatchCount, "swiss");

      winnerGain = Math.round(winnerK * (0.5 - expectedWinner));
      loserLoss = Math.round(loserK * (expectedLoser - 0.5)); 
    } else {
      // --- WIN/LOSS LOGIC ---
      if (state.currentMode === "gauntlet") {
        const isChampionWinner = state.gauntletChampion && winnerId === state.gauntletChampion.id;
        const isFallingWinner = state.gauntletFalling && state.gauntletFallingItem && winnerId === state.gauntletFallingItem.id;
        const isChampionLoser = state.gauntletChampion && loserId === state.gauntletChampion.id;
        const isFallingLoser = state.gauntletFalling && state.gauntletFallingItem && loserId === state.gauntletFallingItem.id;
        
        const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
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
      } else if (state.currentMode === "champion") {
        const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
        const winnerK = getKFactor(winnerRating, winnerMatchCount, "champion");
        const loserK = getKFactor(loserRating, loserMatchCount, "champion");
        
        winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
        loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
      } else {
        // Swiss Mode Default
        const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
        const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
        const loserK = getKFactor(loserRating, loserMatchCount, "swiss");
        
        winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
        loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
      }
    }
    
    // 4. Finalize Ratings
    const newWinnerRating = Math.min(100, Math.max(1, winnerRating + winnerGain));
    const newLoserRating = Math.min(100, Math.max(1, loserRating - loserLoss));
    
    // 5. Determine if we should update full stats (History) or just the Rating
    const winnerRankAtStart = winnerId === state.currentPair.left?.id ? state.currentRanks.left : state.currentRanks.right;
    const isFirstMatchGlobal = (state.currentMode === "gauntlet" || state.currentMode === "champion") && !state.gauntletChampion;
    
    const shouldTrackWinner = state.battleType === "performers" && (isActiveParticipant(winnerId, winnerRankAtStart) || isFirstMatchGlobal);
    const shouldTrackLoser = state.battleType === "performers" && (isActiveParticipant(loserId, loserRank) || isFirstMatchGlobal);
    
    // Winner Status: true = win, false = loss, null = draw
    const winnerStatus = isDraw ? null : true;
    const loserStatus = isDraw ? null : false;

    // 6. SINGLE SOURCE OF TRUTH: Update Database
    // Update Winner
    await updateItemRating(winnerId, newWinnerRating, shouldTrackWinner ? freshWinnerObj : null, winnerStatus);
    // Update Loser
    await updateItemRating(loserId, newLoserRating, shouldTrackLoser ? freshLoserObj : null, loserStatus);
    
    return { 
        newWinnerRating, 
        newLoserRating, 
        winnerChange: winnerGain, 
        loserChange: -loserLoss 
    };
}
  
export async function updateItemRating(itemId, newRating, itemObj = null, won = null) {
    if (state.battleType === "performers") {
      return await updatePerformerRating(itemId, newRating, itemObj, won);
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
  
  // FIX: Use the imported getPerformerFilter and pass the required arguments
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
    const query = `
    query AllPerformerStats {
      allPerformers {
        id
        name
        rating100
        details
      }
    }`;

    try {
        const result = await graphqlQuery(query);
        const performers = result.allPerformers || [];
        
        // REMOVED the filter so unrated performers (null) show up
        // We still sort them, treating null as 50
        return performers.sort((a, b) => {
            const rA = a.rating100 ?? 50;
            const rB = b.rating100 ?? 50;
            return rB - rA;
        });
    } catch (err) {
        console.error("[HotOrNot] Failed to fetch all performer stats:", err);
        throw err;
    }
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

export async function updatePerformerRating(id, rating, performerObj = null, won = null) {
  const variables = { id, rating: Math.round(rating) };
  
  if (performerObj && won !== undefined) {
    const stats = updatePerformerStats(parsePerformerEloData(performerObj), won);
    variables.fields = { hotornot_stats: JSON.stringify(stats) };
  }

  await graphqlQuery(`
    mutation($id: ID!, $rating: Int!, $fields: Map) {
      performerUpdate(input: { id: $id, rating100: $rating, custom_fields: { partial: $fields } }) { id }
    }`, variables);
}

export async function updateImageRating(id, rating) {
  await graphqlQuery(`mutation($i: ImageUpdateInput!) { imageUpdate(input: $i) { id } }`, {
    i: { id, rating100: Math.max(1, Math.min(100, Math.round(rating))) }
  });
}

/**
 * ============================================
 * 5. CONFIGURATION SERVICES
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
 * 6. CALCULATE RANK LOCALLY
 * ============================================
 */
export async function getPerformerBattleRank(performerId) {
  try {
    // 1. Fetch ratings for ranking AND the target performer's custom fields
    const result = await graphqlQuery(`
      query AllPerformersAndTargetStats($id: ID!) {
        allPerformers {
          id
          rating100
        }
        findPerformer(id: $id) {
          custom_fields
        }
      }
    `, { id: performerId });

    const allPerformers = result.allPerformers || [];
    const targetPerformer = result.findPerformer;

    // 2. Filter for those with ratings and sort descending to calculate Rank
    const ratedPerformers = allPerformers
      .filter(p => p.rating100 !== null)
      .sort((a, b) => (b.rating100 || 0) - (a.rating100 || 0));

    const total = ratedPerformers.length;
    const index = ratedPerformers.findIndex(p => p.id === performerId);

    if (index === -1) return null;

    // 3. Parse the Stats JSON string from the custom field 'hotornot_stats'
    let stats = null;
    const statsJson = targetPerformer?.custom_fields?.["hotornot_stats"];
    
    if (statsJson) {
      try {
        // Since it's saved as a JSON string, we must parse it into an object
        stats = typeof statsJson === 'string' ? JSON.parse(statsJson) : statsJson;
      } catch (e) {
        console.warn("[HotOrNot] Could not parse hotornot_stats for performer:", performerId);
      }
    }

    return {
      rank: index + 1,
      total: total,
      rating: ratedPerformers[index].rating100,
      stats: stats // This is now the object { wins: X, losses: Y, ... }
    };
  } catch (err) {
    console.error("[HotOrNot] Error calculating rank:", err);
    return null;
  }
}