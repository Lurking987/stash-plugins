import { graphqlQuery, PERFORMER_FRAGMENT, fetchPerformerCount } from './api-client.js';
import { getPerformerFilter } from './parsers.js';
import { state } from './state.js';
import { loadNewPair } from './battle-engine.js';

/**
 * Fetches potential champions to start a Gauntlet
 */
export async function fetchPerformersForSelection(count = 5) {
  const filter = getPerformerFilter();
  const total = await fetchPerformerCount(filter);
  const actualCount = Math.min(count, total);

  const query = `query FindRandomPerformers($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) {
      performers { ${PERFORMER_FRAGMENT} }
    }
  }`;

  const result = await graphqlQuery(query, {
    performer_filter: filter,
    filter: { per_page: Math.min(100, total), sort: "random" }
  });

  return (result.findPerformers.performers || []).sort(() => Math.random() - 0.5).slice(0, actualCount);
}

/**
 * UI Template for the selection cards
 */
function createSelectionCard(performer) {
  const name = performer.name || `Performer #${performer.id}`;
  const rating = performer.rating100 ? `${performer.rating100}/100` : "Unrated";
  
  return `
    <div class="hon-selection-card" data-performer-id="${performer.id}">
      <div class="hon-selection-image-container">
        ${performer.image_path 
          ? `<img class="hon-selection-image" src="${performer.image_path}" alt="${name}" loading="lazy" />`
          : `<div class="hon-selection-image hon-no-image">No Image</div>`}
      </div>
      <div class="hon-selection-info">
        <h4 class="hon-selection-name">${name}</h4>
        <div class="hon-selection-rating">${rating}</div>
      </div>
    </div>`;
}

/**
 * Orchestrator for the selection screen
 */
export async function loadPerformerSelection() {
  const listEl = document.getElementById("hon-performer-list");
  if (!listEl) return;

  try {
    const performers = await fetchPerformersForSelection(5);
    listEl.innerHTML = performers.map(p => createSelectionCard(p)).join('');
    
    listEl.querySelectorAll('.hon-selection-card').forEach(card => {
      card.onclick = () => {
        const selected = performers.find(p => p.id.toString() === card.dataset.performerId);
        if (selected) startGauntletWithPerformer(selected);
      };
    });
  } catch (err) {
    listEl.innerHTML = `<div class="hon-error">Error: ${err.message}</div>`;
  }
}

function startGauntletWithPerformer(performer) {
  // Update the global state
  state.gauntletChampion = performer;
  state.gauntletWins = 0;
  state.gauntletDefeated = [];
  state.gauntletFalling = false;
  
  // Toggle UI visibility
  document.getElementById("hon-performer-selection").style.display = "none";
  document.getElementById("hon-comparison-area").style.display = "";
  document.querySelector(".hon-actions").style.display = "";
  
  loadNewPair();
}

/**
 * Exporting this so the UI Manager can call it to show the selection screen
 */
export function showPerformerSelection() {
  const selectionContainer = document.getElementById("hon-performer-selection");
  if (selectionContainer) {
    selectionContainer.style.display = "block";
    loadPerformerSelection();
  }
  
  // Hide the comparison area until a performer is selected
  const comparisonArea = document.getElementById("hon-comparison-area");
  const actionsEl = document.querySelector(".hon-actions");
  if (comparisonArea) comparisonArea.style.display = "none";
  if (actionsEl) actionsEl.style.display = "none";
}

 export function showPlacementScreen(item, rank, finalRating) {
    const comparisonArea = document.getElementById("hon-comparison-area");
    if (!comparisonArea) return;
    
    // Handle scenes, performers, and images
    let title, imagePath;
    
    if (battleType === "performers") {
      // Performer
      title = item.name || `Performer #${item.id}`;
      imagePath = item.image_path;
    } else if (battleType === "images") {
      // Image
      title = `Image #${item.id}`;
      imagePath = item.paths && item.paths.thumbnail ? item.paths.thumbnail : null;
    } else {
      // Scene
      const file = item.files && item.files[0] ? item.files[0] : {};
      title = item.title;
      if (!title && file.path) {
        const pathParts = file.path.split(/[/\\]/);
        title = pathParts[pathParts.length - 1].replace(/\.[^/.]+$/, "");
      }
      if (!title) {
        title = `Scene #${item.id}`;
      }
      imagePath = item.paths ? item.paths.screenshot : null;
    }
    
    comparisonArea.innerHTML = `
      <div class="hon-victory-screen">
        <div class="hon-victory-crown">📍</div>
        <h2 class="hon-victory-title">PLACED!</h2>
        <div class="hon-victory-scene">
          ${imagePath 
            ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />`
            : `<div class="hon-victory-image hon-no-image">No Image</div>`
          }
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
    const statusEl = document.getElementById("hon-gauntlet-status");
    const actionsEl = document.querySelector(".hon-actions");
    if (statusEl) statusEl.style.display = "none";
    if (actionsEl) actionsEl.style.display = "none";
    
    // Reset state
    gauntletFalling = false;
    gauntletFallingItem = null;
    gauntletChampion = null;
    gauntletWins = 0;
    gauntletDefeated = [];
    
    // Attach button handler
    const newBtn = comparisonArea.querySelector("#hon-new-gauntlet");
    if (newBtn) {
      newBtn.addEventListener("click", () => {
        if (actionsEl) actionsEl.style.display = "";
        loadNewPair();
      });
    }
 }