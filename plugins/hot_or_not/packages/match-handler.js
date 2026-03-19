import { state } from './state.js';
import { handleComparison, updateItemRating, undoLastMatch } from './api-client.js';
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
		// FIX: Use handleComparison instead of updateItemRating directly
		await handleComparison(
		  winnerId, // falling item (now winner)
		  loserId,  // the opponent they beat
		  winnerRating, 
		  loserRating, 
		  null, // no rank for placement matches
		  winnerItem, 
		  loserItem, 
		  false // not a draw
		);
		const finalRank = Math.max(1, (loserRank || 1) - 1);
		
		applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, { newWinnerRating: finalRating, newLoserRating: loserRating, winnerChange: 0, loserChange: 0 });
		setTimeout(() => showPlacementScreen(winnerItem, finalRank, finalRating, state.battleType, state.totalItemsCount), 800);
	  } else {
		// Falling item lost again, keep going down.
		state.gauntletDefeated.push(winnerId);
		// FIX: Use handleComparison instead of updateItemRating directly
		const outcome = await handleComparison(
		  winnerId, // winner (the challenger)
		  state.gauntletFallingItem.id, // loser (the falling item)
		  winnerRating, 
		  loserRating, 
		  null, // no rank for falling matches
		  winnerItem, 
		  loserItem, // loserItem is the falling item
		  false // not a draw
		);
		applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome);
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
 * Updates Champion mode state.
 * Winner stays on and inherits the climb position.
 * When dethroned, the new champion continues from the same spot in the defeated list
 * so the climb toward #1 is never reset.
 */
function updateChampionModeState(winnerId, winnerItem, loserId, newWinnerRating) {
  if (state.gauntletChampion?.id === winnerId) {
    // Sitting champion won — extend streak, record defeated opponent
    state.gauntletDefeated.push(loserId);
    state.gauntletWins++;
    state.gauntletChampion.rating100 = newWinnerRating;
  } else {
    // Challenger won — becomes new champion, inherits the climb (defeated list stays)
    state.gauntletChampion = winnerItem;
    state.gauntletWins = 1;
    // gauntletDefeated intentionally NOT reset — climb continues from same position
  }
}

/**
 * Skip applies ELO draw mechanics per spec:
 * higher-rated performer loses points to lower-rated.
 * In gauntlet mode, also marks the right-side opponent as skipped so
 * handleMatchmakingLogic picks someone different next round.
 */
export async function handleSkip() {
  const left  = state.currentPair?.left;
  const right = state.currentPair?.right;

  if (left && right) {
    const leftRating  = left.rating100  || 50;
    const rightRating = right.rating100 || 50;

    // Apply draw ELO to both sides (isDraw = true)
    // We pass left as "winner" and right as "loser" — the draw logic is symmetric
    await handleComparison(
      left.id, right.id,
      leftRating, rightRating,
      null, left, right,
      true  // isDraw
    );
  }

  if (state.currentMode === 'gauntlet' && right) {
    state.skippedId = right.id;
    console.log(`[HotOrNot] Skipping Gauntlet opponent: ${right.name}`);
  }

  loadNewPair();
}

/**
 * Undoes the last match, restoring ratings/stats for both performers.
 */
export async function handleUndo() {
  if (!state.matchHistory || state.matchHistory.length === 0) {
    console.log("[HotOrNot] Nothing to undo.");
    return;
  }

  const undoBtn = document.getElementById("hon-undo-btn");
  if (undoBtn) {
    undoBtn.disabled = true;
    undoBtn.textContent = "Undoing…";
  }

  try {
    // undoLastMatch restores DB + state and returns the saved pair snapshot
    const pairSnapshot = await undoLastMatch();

    if (pairSnapshot?.left && pairSnapshot?.right) {
      // Re-render the exact previous pair without fetching from the server
      const { renderCard } = await import('./ui-manager.js');
      const { attachBattleListenersExternal } = await import('./battle-engine.js');
      const area = document.getElementById("hon-comparison-area");
      if (area) {
        state.disableChoice = false;
        area.innerHTML = `
          <div class="hon-vs-container">
            ${renderCard(pairSnapshot.left,  "left",  pairSnapshot.rankLeft)}
            <div class="hon-vs-divider"><span>VS</span></div>
            ${renderCard(pairSnapshot.right, "right", pairSnapshot.rankRight)}
          </div>
        `;
        attachBattleListenersExternal(area);
      }
      console.log("[HotOrNot] Undo successful — previous pair restored.");
    } else {
      // Fallback: no snapshot available, load fresh
      loadNewPair();
    }
  } catch (err) {
    console.error("[HotOrNot] Undo failed:", err);
    loadNewPair();
  } finally {
    const btn = document.getElementById("hon-undo-btn");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "↩ Undo";
      btn.style.display = (state.matchHistory && state.matchHistory.length > 0) ? 'inline-block' : 'none';
    }
  }
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