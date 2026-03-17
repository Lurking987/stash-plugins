import { state } from './state.js';
import { handleComparison, fetchPerformerById, updateItemRating } from './api-client.js';
import { showRatingAnimation } from './ui-manager.js';
import { loadNewPair } from './battle-engine.js';
import { showPlacementScreen } from './ui-manager.js';

/**
 * Main entry point for when a user selects a winner
 */
export async function handleChooseItem(event) {
  if (state.disableChoice) return;
  state.disableChoice = true;

  const body = event.currentTarget;
  const winnerId = body.dataset.winner;
  const isLeftWinner = winnerId === state.currentPair.left.id;
  
  const winnerItem = isLeftWinner ? state.currentPair.left : state.currentPair.right;
  const loserItem = isLeftWinner ? state.currentPair.right : state.currentPair.left;
  const loserId = loserItem.id;

  const winnerCard = body.closest(".hon-scene-card");
  const loserCard = document.querySelector(`[data-performer-id="${loserId}"], [data-scene-id="${loserId}"], [data-image-id="${loserId}"]`);

  const winnerRating = parseInt(winnerCard.dataset.rating) || 50;
  const loserRating = parseInt(loserCard?.dataset.rating) || 50;
  const loserRank = isLeftWinner ? state.currentRanks.right : state.currentRanks.left;

  // --- 1. IMAGES (Swiss Only) ---
  if (state.battleType === "images") {
    const outcome = await handleComparison(winnerId, loserId, winnerRating, loserRating, null, winnerItem, loserItem);
    applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome);
    return;
  }

  // --- 2. GAUNTLET MODE ---
  if (state.currentMode === "gauntlet") {
    // A. Handle "Falling" logic (finding the floor after a loss)
    if (state.gauntletFalling && state.gauntletFallingItem) {
      if (winnerId === state.gauntletFallingItem.id) {
        // Falling item won! Found the floor.
        const finalRating = Math.min(100, loserRating + 1);
        await updateItemRating(winnerId, finalRating, winnerItem, true);
        const finalRank = Math.max(1, (loserRank || 1) - 1);
        
        applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, { newWinnerRating: finalRating, newLoserRating: loserRating, winnerChange: 0, loserChange: 0 });
        setTimeout(() => showPlacementScreen(winnerItem, finalRank, finalRating, state.battleType, state.totalItemsCount), 800);
      } else {
        // Falling item lost again, keep going down.
        state.gauntletDefeated.push(winnerId);
        await updateItemRating(state.gauntletFallingItem.id, loserRating, loserItem, false);
        applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, { newWinnerRating: winnerRating, newLoserRating: loserRating, winnerChange: 0, loserChange: 0 });
      }
      return;
    }

    // B. Normal Gauntlet Climbing
    const outcome = await handleComparison(winnerId, loserId, winnerRating, loserRating, loserRank, winnerItem, loserItem);
    updateGauntletState(winnerId, winnerItem, loserId, loserItem, outcome.newWinnerRating);
    applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome);
    return;
  }

  // --- 3. CHAMPION MODE ---
  if (state.currentMode === "champion") {
    const outcome = await handleComparison(winnerId, loserId, winnerRating, loserRating, loserRank, winnerItem, loserItem);
    updateChampionModeState(winnerId, winnerItem, loserId, outcome.newWinnerRating);
    applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome);
    return;
  }

  // --- 4. SWISS MODE (Default) ---
  const outcome = await handleComparison(winnerId, loserId, winnerRating, loserRating, null, winnerItem, loserItem);
  applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome);
}

/**
 * Updates Gauntlet progression state
 */
function updateGauntletState(winnerId, winnerItem, loserId, loserItem, newWinnerRating) {
  // Case A: The existing Champion (Left) won - Keep Climbing
  if (state.gauntletChampion?.id === winnerId) {
    state.gauntletDefeated.push(loserId);
    state.gauntletWins++;
    state.gauntletChampion.rating100 = newWinnerRating;
  } 
  // Case B: The Challenger (Right) won - Champion is defeated!
  else {
    // If we aren't already falling, the run for this specific performer is now ending.
    // We set them to 'falling' to find their final rank floor.
    if (!state.gauntletFalling) {
      console.log(`[HotOrNot] Champion ${loserItem.name} defeated. Entering placement phase.`);
      state.gauntletFalling = true;
      state.gauntletFallingItem = loserItem; // The original champion is the one we track
      state.gauntletDefeated = [winnerId];   // Reset defeated list to track the 'fall'
    } else {
      // If they were already falling and lost again, keep tracking the fall
      state.gauntletDefeated.push(winnerId);
    }
  }
}
/**
 * Updates Champion mode state (winner stays on)
 */
function updateChampionModeState(winnerId, winnerItem, loserId, newWinnerRating) {
  if (state.gauntletChampion?.id === winnerId) {
    state.gauntletDefeated.push(loserId);
    state.gauntletWins++;
    state.gauntletChampion.rating100 = newWinnerRating;
  } else {
    state.gauntletChampion = winnerItem;
    state.gauntletWins = 1;
    state.gauntletDefeated = [loserId];
  }
}

/**
 * Triggers animations and queues the next pair
 */
 
export async function handleSkip() {
    const rightPerformer = state.currentPair?.right;

    if (state.currentMode === 'gauntlet' && rightPerformer) {
        // Store the ID so the engine knows to pick someone else
        state.skippedId = rightPerformer.id; 
        console.log(`[HotOrNot] Skipping Gauntlet opponent: ${rightPerformer.name}`);
    }

    if (state.currentMode === 'swiss') {
        // ... your existing Swiss tie logic ...
    }

    // Load next pair
    const { loadNewPair } = await import('./battle-engine.js');
    loadNewPair();
}

function applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome) {
  winnerCard.classList.add("hon-winner");
  if (loserCard) loserCard.classList.add("hon-loser");

  showRatingAnimation(winnerCard, winnerRating, outcome.newWinnerRating, outcome.winnerChange, true);
  if (loserCard) {
    showRatingAnimation(loserCard, loserRating, outcome.newLoserRating, outcome.loserChange, false);
  }

  setTimeout(() => {
    // ⭐ FIX: Only load a new pair if we didn't just trigger the placement screen
    // We check if the victory screen exists in the DOM
    const isVictoryVisible = document.querySelector('.hon-victory-screen');
    
    if (!isVictoryVisible) {
      loadNewPair();
    } else {
      console.log("[HotOrNot] Victory screen detected, cancelling next pair load.");
    }
  }, 1500);
}