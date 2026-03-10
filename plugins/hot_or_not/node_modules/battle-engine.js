import { 
  graphqlQuery, SCENE_FRAGMENT, PERFORMER_FRAGMENT, IMAGE_FRAGMENT,
  fetchRandomScenes, fetchRandomPerformers, fetchRandomImages, fetchImageCount,
  updatePerformerRating, updateSceneRating, updateImageRating 
} from './api-client.js';
import { getRecencyWeight, weightedRandomSelect } from './math-utils.js';
import { getPerformerFilterForGender } from './parsers.js';
import { state } from './state.js';
import { 
  createSceneCard, createPerformerCard, createImageCard, 
  createVictoryScreen, renderCard 
} from './ui-manager.js';
import { showPerformerSelection, showPlacementScreen } from './gauntlet-selection.js';
import { handleChooseItem } from './match-handler.js';

/**
 * BATTLE DISPATCHER (The "Brain")
 */
export async function fetchPair() {
  const { battleType, currentMode, selectedGenders } = state;

  if (currentMode === "swiss") {
    if (battleType === "performers") return await fetchSwissPairPerformers(selectedGenders);
    if (battleType === "images") return await fetchSwissPairImages();
    return await fetchSwissPairScenes();
  }

  if (currentMode === "gauntlet") {
    if (battleType === "performers") return await fetchGauntletPairPerformers();
    // Images fallback to Swiss
    if (battleType === "images") return await fetchSwissPairImages();
    return await fetchGauntletPairScenes();
  }

  if (currentMode === "champion") {
    if (battleType === "performers") return await fetchChampionPairPerformers();
    if (battleType === "images") return await fetchSwissPairImages();
    return await fetchChampionPairScenes();
  }
}

/**
 * GAME LOOP
 */
export async function loadNewPair() {
  state.disableChoice = false;
  const area = document.getElementById("hon-comparison-area");
  if (!area) return;

  if (state.currentMode === "gauntlet" && state.battleType === "performers" && !state.gauntletChampion && !state.gauntletFalling) {
    showPerformerSelection();
    return;
  }

  try {
    const result = await fetchPair();

    // End-Game Checks
    if (result.isVictory) {
      area.innerHTML = createVictoryScreen(result.items[0], state.battleType, state.gauntletWins, state.totalItemsCount);
      attachVictoryHandlers(area);
      return;
    }
    
    if (result.isPlacement) {
      showPlacementScreen(result.items[0], result.placementRank, result.placementRating);
      return;
    }

    // Matchup Rendering
    const [left, right] = result.items;
    state.currentPair = { left, right };
    state.currentRanks = { left: result.ranks[0], right: result.ranks[1] };
    
    area.innerHTML = `
      <div class="hon-vs-container">
        ${renderCard(left, "left", result.ranks[0])}
        <div class="hon-vs-divider"><span>VS</span></div>
        ${renderCard(right, "right", result.ranks[1])}
      </div>
    `;

    attachBattleListeners(area);

  } catch (err) {
    area.innerHTML = `<div class="hon-error">Error: ${err.message}</div>`;
  }
}

function attachBattleListeners(area) {
  area.querySelectorAll(".hon-scene-body").forEach(body => {
    body.onclick = (e) => handleChooseItem(e);
  });

  area.querySelectorAll(".hon-scene-card").forEach(card => {
    const video = card.querySelector(".hon-hover-preview");
    if (!video) return;
    card.onmouseenter = () => video.play().catch(() => {});
    card.onmouseleave = () => { video.pause(); video.currentTime = 0; };
  });
}

function attachVictoryHandlers(area) {
  const btn = area.querySelector("#hon-new-gauntlet");
  if (btn) {
    btn.onclick = () => {
      // Logic to reset state and call loadNewPair()
      state.gauntletChampion = null;
      state.gauntletWins = 0;
      loadNewPair();
    };
  }
}

/**
 * MODE-SPECIFIC FETCHERS (Swiss, Images, etc.)
 */
export async function fetchSwissPairImages() {
  const totalImages = await fetchImageCount();
  const useSampling = totalImages > 1000;
  const sampleSize = useSampling ? Math.min(500, totalImages) : totalImages;
  
  const query = `query FindImagesByRating($filter: FindFilterType) {
    findImages(filter: $filter) { images { ${IMAGE_FRAGMENT} } }
  }`;

  const result = await graphqlQuery(query, {
    filter: {
      per_page: sampleSize,
      sort: useSampling ? "random" : "rating",
      direction: useSampling ? undefined : "DESC"
    }
  });

  const images = result.findImages.images || [];
  if (images.length < 2) return { items: await fetchRandomImages(2), ranks: [null, null] };

  const image1 = images[Math.floor(Math.random() * images.length)];
  const rating1 = image1.rating100 || 50;

  const matchWindow = images.length > 50 ? 10 : 20;
  const similar = images.filter(s => s.id !== image1.id && Math.abs((s.rating100 || 50) - rating1) <= matchWindow);

  const image2 = similar.length > 0 ? similar[Math.floor(Math.random() * similar.length)] : images.filter(s => s.id !== image1.id)[0];

  return { 
    items: [image1, image2], 
    ranks: useSampling ? [null, null] : [images.indexOf(image1) + 1, images.indexOf(image2) + 1] 
  };
}

/**
 * ============================================
 * SCENE FETCHERS
 * ============================================
 */

export async function fetchSwissPairScenes() {
  const result = await graphqlQuery(`query FindScenesByRating($filter: FindFilterType) {
    findScenes(filter: $filter) { scenes { ${SCENE_FRAGMENT} } }
  }`, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });

  const scenes = result.findScenes.scenes || [];
  if (scenes.length < 2) return { items: await fetchRandomScenes(2), ranks: [null, null] };

  const scene1 = scenes[Math.floor(Math.random() * scenes.length)];
  const rating1 = scene1.rating100 || 50;
  const matchWindow = scenes.length > 50 ? 10 : 20;

  const similar = scenes.filter(s => s.id !== scene1.id && Math.abs((s.rating100 || 50) - rating1) <= matchWindow);
  const scene2 = similar.length > 0 ? similar[Math.floor(Math.random() * similar.length)] : scenes.find(s => s.id !== scene1.id);

  return { items: [scene1, scene2], ranks: [scenes.indexOf(scene1) + 1, scenes.indexOf(scene2) + 1] };
}

export async function fetchGauntletPairScenes() {
  const result = await graphqlQuery(`query FindScenesByRating($filter: FindFilterType) {
    findScenes(filter: $filter) { count, scenes { ${SCENE_FRAGMENT} } }
  }`, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });

  const scenes = result.findScenes.scenes || [];
  state.totalItemsCount = result.findScenes.count || scenes.length;
  if (scenes.length < 2) return { items: await fetchRandomScenes(2), ranks: [null, null], isVictory: false };

  // Logic for Champion vs Challenger or Falling
  return handleMatchmakingLogic(scenes, "scenes");
}

export async function fetchChampionPairScenes() {
  return fetchGauntletPairScenes(); // Champion mode uses same fetcher, just different rating logic in match-handler
}

/**
 * ============================================
 * PERFORMER FETCHERS
 * ============================================
 */

export async function fetchSwissPairPerformers(selectedGenders) {
  const performerFilter = getPerformerFilterForGender(selectedGenders[Math.floor(Math.random() * selectedGenders.length)]);
  const result = await graphqlQuery(`query FindPerformersByRating($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) { performers { ${PERFORMER_FRAGMENT} } }
  }`, { performer_filter: performerFilter, filter: { per_page: -1, sort: "rating", direction: "DESC" } });

  const performers = result.findPerformers.performers || [];
  if (performers.length < 2) return { items: await fetchRandomPerformers(2), ranks: [null, null] };

  const weightedList = performers.map((p, idx) => ({ p, weight: getRecencyWeight(p), idx }));
  const s1 = weightedRandomSelect(weightedList, weightedList.map(item => item.weight));
  
  const rating1 = s1.p.rating100 || 50;
  const similar = weightedList.filter(item => item.p.id !== s1.p.id && Math.abs((item.p.rating100 || 50) - rating1) <= 15);
  const s2 = similar.length > 0 ? weightedRandomSelect(similar, similar.map(i => i.weight)) : weightedList.find(i => i.p.id !== s1.p.id);

  return { items: [s1.p, s2.p], ranks: [s1.idx + 1, s2.idx + 1] };
}

export async function fetchGauntletPairPerformers() {
  const gender = state.gauntletChampion?.gender || state.selectedGenders[0];
  const performerFilter = getPerformerFilterForGender(gender);
  
  const result = await graphqlQuery(`query FindPerformersByRating($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) { count, performers { ${PERFORMER_FRAGMENT} } }
  }`, { performer_filter: performerFilter, filter: { per_page: -1, sort: "rating", direction: "DESC" } });

  const performers = result.findPerformers.performers || [];
  state.totalItemsCount = performers.length;
  if (performers.length < 2) return { items: await fetchRandomPerformers(2), ranks: [null, null], isVictory: false };

  return handleMatchmakingLogic(performers, "performers");
}

export async function fetchChampionPairPerformers() {
  return fetchGauntletPairPerformers();
}

/**
 * ============================================
 * MATCHMAKING HELPERS (Gauntlet/Champion Internal)
 * ============================================
 */

function handleMatchmakingLogic(list, type) {
  // 1. Handle Falling State
  if (state.gauntletFalling && state.gauntletFallingItem) {
    const fallIdx = list.findIndex(i => i.id === state.gauntletFallingItem.id);
    const below = list.filter((i, idx) => idx > fallIdx && !state.gauntletDefeated.includes(i.id));
    
    if (below.length === 0) {
      return { items: [state.gauntletFallingItem], ranks: [list.length], isVictory: false, isPlacement: true, placementRank: list.length, placementRating: 1 };
    }
    const nextBelow = below[0];
    return { items: [state.gauntletFallingItem, nextBelow], ranks: [fallIdx + 1, list.indexOf(nextBelow) + 1], isFalling: true };
  }

  // 2. No Champion - Start New
  if (!state.gauntletChampion) {
    const challenger = list[Math.floor(Math.random() * list.length)];
    const lowest = [...list].sort((a, b) => (a.rating100 || 0) - (b.rating100 || 0))[0];
    return { items: [challenger, lowest], ranks: [list.indexOf(challenger) + 1, list.indexOf(lowest) + 1], isVictory: false };
  }

  // 3. Existing Champion - Find Next
  const champIdx = list.findIndex(i => i.id === state.gauntletChampion.id);
  const opponents = list.filter((i, idx) => i.id !== state.gauntletChampion.id && !state.gauntletDefeated.includes(i.id) && (idx < champIdx || (i.rating100 || 0) >= (state.gauntletChampion.rating100 || 0)));

  if (opponents.length === 0) return { items: [state.gauntletChampion], ranks: [1], isVictory: true };

  const nextOpponent = opponents[opponents.length - 1]; // Closest opponent
  return { items: [state.gauntletChampion, nextOpponent], ranks: [champIdx + 1, list.indexOf(nextOpponent) + 1], isVictory: false };
}

export function isChampionVictory(currentIndex, defeatedList, totalList) {
  return totalList.filter((item, idx) => idx < currentIndex && !defeatedList.includes(item.id)).length === 0;
}
