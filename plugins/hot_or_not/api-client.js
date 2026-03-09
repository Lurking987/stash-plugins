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

/**
 * Fetches a performer's rating and calculates their rank among all performers
 */
export async function getPerformerBattleRank(performerId) {
    try {
        // 1. Get the specific performer's rating
        const performerData = await graphqlQuery(`
            query FindPerformer($id: ID!) {
                findPerformer(id: $id) {
                    id
                    name
                    rating100
                }
            }`, { id: performerId });

        const performer = performerData.findPerformer;
        if (!performer || !performer.rating100) return null;

        // 2. Get all performers with ratings to calculate rank
        // Note: For large libraries, you might want to cache this or use a specific aggregate query
        const allRatingsData = await graphqlQuery(`
            query AllPerformerRatings {
                allPerformers {
                    rating100
                }
            }`);

        const ratings = allRatingsData.allPerformers
            .map(p => p.rating100)
            .filter(r => r != null)
            .sort((a, b) => b - a);

        const rank = ratings.indexOf(performer.rating100) + 1;
        const total = ratings.length;

        return {
            rank,
            total,
            rating: performer.rating100,
            stats: `${rank} / ${total}`
        };
    } catch (err) {
        console.error("[HotOrNot] Error fetching battle rank:", err);
        return null;
    }
}

// ... include your fetchRandomPerformers, fetchImageCount, and fetchRandomImages here

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
