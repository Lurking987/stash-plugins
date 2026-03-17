import { fetchAllPerformerStats } from './api-client.js';
import { parsePerformerEloData } from './math-utils.js';
import { escapeHtml } from './formatters.js';

/**
 * ============================================
 * STATS MODAL
 * ============================================
 */

export async function openStatsModal() {
  const existingStatsModal = document.getElementById("hon-stats-modal");
  if (existingStatsModal) existingStatsModal.remove();

  const statsModal = document.createElement("div");
  statsModal.id = "hon-stats-modal";
  statsModal.className = "hon-stats-modal";
  statsModal.innerHTML = `
    <div class="hon-modal-backdrop"></div>
    <div class="hon-stats-modal-dialog">
      <button class="hon-modal-close">✕</button>
      <div class="hon-stats-loading">Loading stats...</div>
    </div>
  `;
  document.body.appendChild(statsModal);

  const closeStats = () => statsModal.remove();
  const dialogContainer = statsModal.querySelector(".hon-stats-modal-dialog");

  // Clicks inside the dialog box should not close the modal
  dialogContainer.addEventListener("click", (e) => e.stopPropagation());
  statsModal.querySelector(".hon-modal-backdrop").addEventListener("click", closeStats);
  statsModal.querySelector(".hon-modal-close").addEventListener("click", closeStats);

  try {
    const performers = await fetchAllPerformerStats();
    const content = createStatsModalContent(performers);

    dialogContainer.innerHTML = `
      <button class="hon-modal-close">✕</button>
      ${content}
    `;

    dialogContainer.addEventListener("click", (e) => e.stopPropagation());
    dialogContainer.querySelector(".hon-modal-close").addEventListener("click", closeStats);

    initStatsTabs(dialogContainer);
    initStatsCollapsibles(dialogContainer);
  } catch (error) {
    console.error("[HotOrNot] Error loading stats:", error);
    dialogContainer.innerHTML = `
      <button class="hon-modal-close">✕</button>
      <div class="hon-stats-error">Failed to load statistics.</div>
    `;
    dialogContainer.querySelector(".hon-modal-close").addEventListener("click", closeStats);
  }
}

export function createStatsModalContent(performers) {
  if (!performers || performers.length === 0) {
    return '<div class="hon-stats-empty">No performer stats available</div>';
  }

  const processedPerformers = performers.map((p, idx) => {
    const stats = parsePerformerEloData(p);
    const rawRating = p.rating100 ?? 50;
    return {
      ...stats,
      rank: idx + 1,
      id: p.id,
      name: p.name || `Performer #${p.id}`,
      rating: (rawRating / 10).toFixed(1)
    };
  });

  const rankGroupsHTML = generateStatTables(processedPerformers);

  const ratingBuckets = new Array(101).fill(0);
  performers.forEach(p => {
    const r = p.rating100 ?? 50;
    if (r >= 0 && r <= 100) ratingBuckets[r]++;
  });

  return `
    <div class="hon-stats-header">
      <h2>📊 Performer Statistics</h2>
      <div class="hon-stats-tabs">
        <button class="hon-stats-tab active" data-tab="leaderboard">Leaderboard</button>
        <button class="hon-stats-tab" data-tab="distribution">Rating Distribution</button>
      </div>
    </div>
    <div class="hon-stats-content">
      <div class="hon-stats-tab-panel active" data-panel="leaderboard">
        ${rankGroupsHTML}
      </div>
      <div class="hon-stats-tab-panel" data-panel="distribution">
        <div class="hon-bar-graph">
          ${generateBarGroups(ratingBuckets)}
        </div>
      </div>
    </div>
  `;
}

export function generateStatTables(processedPerformers) {
  const groups = [];
  const groupSize = 250;

  for (let i = 0; i < processedPerformers.length; i += groupSize) {
    const chunk = processedPerformers.slice(i, i + groupSize);
    const startRank = i + 1;
    const endRank = Math.min(i + groupSize, processedPerformers.length);

    const rows = chunk.map(p => {
      const winRate = p.total_matches > 0 ? ((p.wins / p.total_matches) * 100).toFixed(1) : 'N/A';
      const streakDisplay = p.current_streak > 0
        ? `<span class="hon-stats-positive">+${p.current_streak}</span>`
        : p.current_streak < 0 ? `<span class="hon-stats-negative">${p.current_streak}</span>` : '0';

      return `
        <tr>
          <td class="hon-stats-rank">#${p.rank}</td>
          <td class="hon-stats-name"><a href="/performers/${p.id}" target="_blank">${escapeHtml(p.name)}</a></td>
          <td class="hon-stats-rating">${p.rating}</td>
          <td>${p.total_matches}</td>
          <td class="hon-stats-positive">${p.wins}</td>
          <td class="hon-stats-negative">${p.losses}</td>
          <td>${p.draws || 0}</td>
          <td>${winRate}%</td>
          <td>${streakDisplay}</td>
          <td class="hon-stats-positive">${p.best_streak}</td>
          <td class="hon-stats-negative">${p.worst_streak}</td>
        </tr>`;
    }).join('');

    groups.push(`
      <div class="hon-rank-group">
        <div class="hon-rank-group-header" data-group="${i}" role="button">
          <span class="hon-group-toggle">▶</span>
          <span class="hon-rank-group-title">Ranks ${startRank}-${endRank}</span>
        </div>
        <div class="hon-rank-group-content collapsed" data-group="${i}">
          <table class="hon-stats-table">
            <thead>
              <tr>
                <th>Rank</th><th>Name</th><th>Rating</th><th>Matches</th>
                <th>W</th><th>L</th><th>D</th><th>%</th>
                <th>Streak</th><th>Best</th><th>Worst</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`);
  }
  return groups.join('');
}

export function generateBarGroups(ratingBuckets) {
  // Determine if data is heavily clustered (top bucket holds >50% of non-zero total)
  const totalPerformers = ratingBuckets.reduce((s, c) => s + c, 0);
  const maxBucket = Math.max(...ratingBuckets, 1);
  const isClustered = totalPerformers > 0 && (maxBucket / totalPerformers) > 0.5;

  // When clustered, group into ranges of 5 to spread differences
  if (isClustered) {
    const grouped = [];
    for (let i = 0; i <= 100; i += 5) {
      const count = ratingBuckets.slice(i, i + 5).reduce((s, c) => s + c, 0);
      grouped.push({ label: `${i}–${Math.min(i + 4, 100)}`, count });
    }
    const groupMax = Math.max(...grouped.map(g => g.count), 1);
    return grouped.map(({ label, count }) => {
      if (count === 0) return '';
      const percentage = (count / groupMax) * 100;
      return `
        <div class="hon-bar-container" title="Rating ${label}: ${count} performers">
          <div class="hon-bar-label" style="min-width:60px">${label}</div>
          <div class="hon-bar-wrapper">
            <div class="hon-bar" style="width: ${percentage}%">
              ${count > 2 ? `<span class="hon-bar-count">${count}</span>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  // Default: per-point bars
  return ratingBuckets.map((count, i) => {
    if (count === 0) return '';
    const percentage = (count / maxBucket) * 100;
    return `
      <div class="hon-bar-container" title="Rating ${i}: ${count} performers">
        <div class="hon-bar-label">${i}</div>
        <div class="hon-bar-wrapper">
          <div class="hon-bar" style="width: ${percentage}%">
            ${count > 5 ? `<span class="hon-bar-count">${count}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

/**
 * Internal: Tab switching logic
 */
function initStatsTabs(dialog) {
  const buttons = dialog.querySelectorAll(".hon-stats-tab");
  const panels = dialog.querySelectorAll(".hon-stats-tab-panel");

  buttons.forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.toggle("active", b === btn));
      panels.forEach(p => p.classList.toggle("active", p.dataset.panel === target));
    };
  });
}

/**
 * Internal: Collapsible group logic
 */
function initStatsCollapsibles(dialog) {
  const headers = dialog.querySelectorAll(".hon-rank-group-header, .hon-bar-group-header");
  headers.forEach(header => {
    header.onclick = (e) => {
      e.stopPropagation();
      const groupType = header.classList.contains("hon-rank-group-header")
        ? ".hon-rank-group-content"
        : ".hon-bar-group-content";
      const content = dialog.querySelector(`${groupType}[data-group="${header.dataset.group}"]`);
      const isCollapsed = content.classList.toggle("collapsed");
      header.setAttribute("aria-expanded", !isCollapsed);
      header.querySelector(".hon-group-toggle").textContent = isCollapsed ? "▶" : "▼";
    };
  });
}
