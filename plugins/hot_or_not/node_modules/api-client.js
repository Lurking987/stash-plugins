import { getPerformerFilter } from './parsers.js';
import { parsePerformerEloData, updatePerformerStats } from './math-utils.js';

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

// ... include your fetchRandomPerformers, fetchImageCount, and fetchRandomImages here
export async function handleComparison(winnerId, loserId, winnerCurrentRating, loserCurrentRating, loserRank = null, winnerObj = null, loserObj = null) {
    const winnerRating = winnerCurrentRating || 50;
    const loserRating = loserCurrentRating || 50;
    
    const ratingDiff = loserRating - winnerRating;
    
    // Fetch fresh performer data to ensure we have current stats
    // This prevents stats from being overwritten when performers have consecutive matches
    let freshWinnerObj = winnerObj;
    let freshLoserObj = loserObj;
    
    if (battleType === "performers") {
      // Fetch both performers in parallel for better performance
      const [fetchedWinner, fetchedLoser] = await Promise.all([
        (winnerObj && winnerId) ? fetchPerformerById(winnerId) : Promise.resolve(null),
        (loserObj && loserId) ? fetchPerformerById(loserId) : Promise.resolve(null)
      ]);
      
      freshWinnerObj = fetchedWinner || winnerObj;
      freshLoserObj = fetchedLoser || loserObj;
    }
    
    // Parse match counts from custom fields (only for performers)
    let winnerMatchCount = null;
    let loserMatchCount = null;
    if (battleType === "performers" && freshWinnerObj) {
      const winnerStats = parsePerformerEloData(freshWinnerObj);
      winnerMatchCount = winnerStats.total_matches;
    }
    if (battleType === "performers" && freshLoserObj) {
      const loserStats = parsePerformerEloData(freshLoserObj);
      loserMatchCount = loserStats.total_matches;
    }
    
    let winnerGain = 0, loserLoss = 0;
    
    if (currentMode === "gauntlet") {
      // In gauntlet, only the champion/falling scene changes rating
      // Defenders stay the same (they're just benchmarks)
      // EXCEPT: if the defender is rank #1, they lose 1 point when defeated
      const isChampionWinner = gauntletChampion && winnerId === gauntletChampion.id;
      const isFallingWinner = gauntletFalling && gauntletFallingItem && winnerId === gauntletFallingItem.id;
      const isChampionLoser = gauntletChampion && loserId === gauntletChampion.id;
      const isFallingLoser = gauntletFalling && gauntletFallingItem && loserId === gauntletFallingItem.id;
      
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
      const kFactor = getKFactor(winnerRating, winnerMatchCount, "gauntlet");
      
      // Only the active scene (champion or falling) gets rating changes
      if (isChampionWinner || isFallingWinner) {
        winnerGain = Math.max(0, Math.round(kFactor * (1 - expectedWinner)));
      }
      if (isChampionLoser || isFallingLoser) {
        loserLoss = Math.max(0, Math.round(kFactor * expectedWinner));
      }
      
      // Special case: if defender was rank #1 and lost, drop their rating by 1
      if (loserRank === 1 && !isChampionLoser && !isFallingLoser) {
        loserLoss = 1;
      }
    } else if (currentMode === "champion") {
      // Champion mode: Both performers get rating updates, but at a reduced rate (50% of Swiss mode)
      // This allows rankings to evolve while still maintaining the "winner stays on" feel
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
      
      // Use individual K-factors for each performer with champion mode multiplier
      const winnerK = getKFactor(winnerRating, winnerMatchCount, "champion");
      const loserK = getKFactor(loserRating, loserMatchCount, "champion");
      
      // Calculate changes using their respective K-factors (reduced by 50% for champion mode)
      winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
      loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
    } else {
      // Swiss mode: True ELO - both change based on expected outcome
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
      
      // Use individual K-factors for each performer for more accurate adjustments
      const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
      const loserK = getKFactor(loserRating, loserMatchCount, "swiss");
      
      // Calculate changes using their respective K-factors
      winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
      loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
    }
    
    const newWinnerRating = Math.min(100, Math.max(1, winnerRating + winnerGain));
    const newLoserRating = Math.min(100, Math.max(1, loserRating - loserLoss));
    
    const winnerChange = newWinnerRating - winnerRating;
    const loserChange = newLoserRating - loserRating;
    
    // Determine which participants should have stats tracked
    const winnerRank = winnerId === currentPair.left?.id ? currentRanks.left : currentRanks.right;
    
    // In champion/gauntlet mode with no champion yet (first match), both participants should get full stats tracked
    const isFirstMatchInGauntletMode = (currentMode === "gauntlet" || currentMode === "champion") && !gauntletChampion;
    const shouldTrackWinner = battleType === "performers" && (isActiveParticipant(winnerId, winnerRank) || isFirstMatchInGauntletMode);
    const shouldTrackLoser = battleType === "performers" && (isActiveParticipant(loserId, loserRank) || isFirstMatchInGauntletMode);
    
    // Update items in Stash
    // Pass win/loss status for stats tracking:
    // - true/false for active participants (track full stats)
    // - null for defenders in gauntlet mode only (track participation only)
    
    // Winner updates
    if (winnerChange !== 0 || (battleType === "performers" && freshWinnerObj && shouldTrackWinner)) {
      // Update rating if changed, or always update stats if active participant
      updateItemRating(winnerId, newWinnerRating, shouldTrackWinner ? freshWinnerObj : null, shouldTrackWinner ? true : null);
    } else if (battleType === "performers" && freshWinnerObj && currentMode === "gauntlet") {
      // Defender in gauntlet mode only - track participation only
      updateItemRating(winnerId, newWinnerRating, freshWinnerObj, null);
    }
    
    // Loser updates
    if (loserChange !== 0 || (battleType === "performers" && freshLoserObj && shouldTrackLoser)) {
      // Update rating if changed, or always update stats if active participant
      updateItemRating(loserId, newLoserRating, shouldTrackLoser ? freshLoserObj : null, shouldTrackLoser ? false : null);
    } else if (battleType === "performers" && freshLoserObj && currentMode === "gauntlet") {
      // Defender in gauntlet mode only - track participation only
      updateItemRating(loserId, newLoserRating, freshLoserObj, null);
    }
    
    return { newWinnerRating, newLoserRating, winnerChange, loserChange };
  }
  
export async function updateItemRating(itemId, newRating, itemObj = null, won = null) {
    if (battleType === "performers") {
      return await updatePerformerRating(itemId, newRating, itemObj, won);
    } else if (battleType === "images") {
      return await updateImageRating(itemId, newRating);
    } else {
      return await updateSceneRating(itemId, newRating);
    }
  }
  
export async function fetchRandomPerformers(count = 2) {
  if (selectedGenders.length === 0) {
    throw new Error("No genders selected. Please select at least one gender in the filter.");
  }
  const battleGender = selectedGenders[Math.floor(Math.random() * selectedGenders.length)];
  const performerFilter = getPerformerFilterForGender(battleGender);
  const totalPerformers = await fetchPerformerCount(performerFilter);
  if (totalPerformers < 2) {
    throw new Error("Not enough performers for comparison. You need at least 2 performers matching the selected gender.");
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

  const allPerformers = result.findPerformers.performers || [];
  
  if (allPerformers.length < 2) {
    throw new Error("Not enough performers for comparison. You need at least 2 performers.");
  }

  const shuffled = allPerformers.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
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
    // 1. Get all performers with ratings
    const result = await graphqlQuery(`
      query AllPerformersRatings {
        allPerformers {
          id
          rating100
        }
      }
    `);

    const allPerformers = result.allPerformers || [];
    // 2. Filter for those with ratings and sort descending
    const ratedPerformers = allPerformers
      .filter(p => p.rating100 !== null)
      .sort((a, b) => b.rating100 - a.rating100);

    const total = ratedPerformers.length;
    const index = ratedPerformers.findIndex(p => p.id === performerId);

    if (index === -1) return null;

    return {
      rank: index + 1,
      total: total,
      rating: ratedPerformers[index].rating100
    };
  } catch (err) {
    console.error("[HotOrNot] Error calculating rank:", err);
    return null;
  }
}
