import { state } from './state.js';
import { getPerformerBattleRank } from './api-client.js';
import { loadNewPair } from './battle-engine.js';

/**
 * ============================================
 * PERFORMER PAGE — BATTLE RANK BADGE
 * ============================================
 */

export function isOnSinglePerformerPage() {
  return window.location.pathname.includes('/performers/') &&
         !window.location.pathname.endsWith('/performers');
}

export function createBattleRankBadge(rank, total, rating, stats = null) {
  const badge = document.createElement("div");
  badge.className = "hon-battle-rank-badge";
  badge.id = "hon-battle-rank-badge";

  // Determine tier emoji from percentile
  const percentile = ((total - rank + 1) / total) * 100;
  let tierEmoji = "🔥";
  if (percentile >= 95) tierEmoji = "👑";
  else if (percentile >= 80) tierEmoji = "🥇";
  else if (percentile >= 60) tierEmoji = "🥈";
  else if (percentile >= 40) tierEmoji = "🥉";

  // Build match stats HTML
  let matchStatsHTML = '';
  let winRate = "0.0";
  const hasMatchStats = stats && stats.total_matches > 0;

  if (hasMatchStats) {
    winRate = ((stats.wins / (stats.total_matches || 1)) * 100).toFixed(1);

    let streakDisplay = '';
    if (stats.current_streak > 0) {
      streakDisplay = `<span class="hon-streak-positive">W${stats.current_streak}</span>`;
    } else if (stats.current_streak < 0) {
      streakDisplay = `<span class="hon-streak-negative">L${Math.abs(stats.current_streak)}</span>`;
    }

    matchStatsHTML = `
      <span class="hon-match-stats">
        <span class="hon-stats-record">
          <span class="hon-wins">${stats.wins}W</span>
          <span class="hon-losses">${stats.losses}L</span>
          <span class="hon-draws">${stats.draws}D</span>
        </span>
        <span class="hon-win-rate">${winRate}%</span>
        ${streakDisplay}
      </span>
    `;
  }

  badge.innerHTML = `
    <span class="hon-rank-emoji">${tierEmoji}</span>
    <span class="hon-rank-text">Battle Rank #${rank}</span>
    <span class="hon-rank-total">of ${total}</span>
    ${matchStatsHTML}
  `;

  // Build tooltip
  let tooltipText = `Battle Rank #${rank} of ${total} performers (Rating: ${rating}/100)`;
  if (hasMatchStats) {
    tooltipText += `\n\nMatch Stats:`;
    tooltipText += `\n• Record: ${stats.wins}W - ${stats.losses}L - ${stats.draws}D`;
    tooltipText += `\n• Win Rate: ${winRate}%`;
    tooltipText += `\n• Total Matches: ${stats.total_matches}`;
    if (stats.current_streak !== 0) {
      const streakType = stats.current_streak > 0 ? 'Winning' : 'Losing';
      tooltipText += `\n• Current Streak: ${streakType} ${Math.abs(stats.current_streak)}`;
    }
    if (stats.best_streak > 0) tooltipText += `\n• Best Streak: ${stats.best_streak}`;
    if (stats.worst_streak < 0) tooltipText += `\n• Worst Streak: ${Math.abs(stats.worst_streak)}`;
  }
  badge.title = tooltipText;

  return badge;
}

export async function injectBattleRankBadge() {
  const pathParts = window.location.pathname.split('/');
  const pIndex = pathParts.indexOf('performers');
  if (pIndex === -1 || !pathParts[pIndex + 1]) return;
  const performerId = pathParts[pIndex + 1];

  setTimeout(async () => {
    if (window._honBadgeInjectionInProgress) return;
    window._honBadgeInjectionInProgress = true;
    try {
      const ratingEl = document.querySelector(".quality-group");
      if (ratingEl && !document.getElementById("hon-battle-rank-badge")) {
        const rankInfo = await getPerformerBattleRank(performerId);
        if (rankInfo) {
          const badge = createBattleRankBadge(
            rankInfo.rank,
            rankInfo.total,
            rankInfo.rating,
            rankInfo.stats
          );
          ratingEl.append(badge);
        }
      }
    } finally {
      window._honBadgeInjectionInProgress = false;
    }
  }, 200);
}

/**
 * ============================================
 * PLACEMENT SCREEN
 * ============================================
 */

export function showPlacementScreen(item, rank, finalRating, battleType, totalItemsCount) {
  const area = document.getElementById("hon-comparison-area");
  if (!area) return;

  let title, imagePath;
  if (battleType === "performers") {
    title = item.name || `Performer #${item.id}`;
    imagePath = item.image_path;
  } else if (battleType === "images") {
    title = `Image #${item.id}`;
    imagePath = item.paths?.thumbnail || null;
  } else {
    const file = item.files?.[0] || {};
    title = item.title
      || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "")
      || `Scene #${item.id}`;
    imagePath = item.paths?.screenshot || null;
  }

  area.innerHTML = `
    <div class="hon-victory-screen">
      <div class="hon-victory-crown">📍</div>
      <h2 class="hon-victory-title">PLACED!</h2>
      <div class="hon-victory-scene">
        ${imagePath
          ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />`
          : `<div class="hon-victory-image hon-no-image">No Image</div>`}
      </div>
      <h3 class="hon-victory-name">${title}</h3>
      <p class="hon-victory-stats">
        Rank <strong>#${rank}</strong> of ${totalItemsCount}<br>
        Rating: <strong>${finalRating}/100</strong>
      </p>
      <button id="hon-new-gauntlet" class="btn btn-primary">Start New Run</button>
    </div>
  `;

  // Hide status and actions
  document.getElementById("hon-gauntlet-status")?.remove();
  const actionsEl = document.querySelector(".hon-actions");
  if (actionsEl) actionsEl.style.display = "none";

  // Reset state
  state.gauntletFalling = false;
  state.gauntletFallingItem = null;
  state.gauntletChampion = null;
  state.gauntletWins = 0;
  state.gauntletDefeated = [];

  // Wire up the restart button
  area.querySelector("#hon-new-gauntlet")?.addEventListener("click", () => {
    if (actionsEl) actionsEl.style.display = "";
    loadNewPair();
  });
}

/**
 * ============================================
 * RATING CHANGE ANIMATION
 * ============================================
 */

export function showRatingAnimation(card, oldRating, newRating, change, isWinner) {
  const overlay = document.createElement("div");
  overlay.className = `hon-rating-overlay ${isWinner ? 'hon-rating-winner' : 'hon-rating-loser'}`;

  const ratingDisplay = document.createElement("div");
  ratingDisplay.className = "hon-rating-display";
  ratingDisplay.textContent = oldRating;

  const changeDisplay = document.createElement("div");
  changeDisplay.className = "hon-rating-change";
  changeDisplay.textContent = (change >= 0 ? "+" : "") + change;

  overlay.appendChild(ratingDisplay);
  overlay.appendChild(changeDisplay);
  card.appendChild(overlay);

  const totalSteps = Math.abs(change);
  if (totalSteps > 0) {
    const step = isWinner ? 1 : -1;
    let stepCount = 0;
    let currentDisplay = oldRating;
    const interval = setInterval(() => {
      stepCount++;
      currentDisplay += step;
      ratingDisplay.textContent = currentDisplay;
      if (stepCount >= totalSteps) {
        clearInterval(interval);
        ratingDisplay.textContent = newRating;
      }
    }, 30);
  }

  setTimeout(() => overlay.remove(), 1400);
}
