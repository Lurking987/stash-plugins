import { state } from './state.js';
import { formatDuration, getCountryDisplay, getGenderDisplay } from './formatters.js';

/**
 * ============================================
 * CARD RENDERING
 * ============================================
 */

export function renderCard(item, side, rank) {
  const streak = (state.gauntletChampion?.id === item.id) ? state.gauntletWins : null;
  if (state.battleType === "performers") return createPerformerCard(item, side, rank, streak);
  if (state.battleType === "images") return createImageCard(item, side, rank, streak);
  return createSceneCard(item, side, rank, streak);
}

export function createSceneCard(scene, side, rank = null, streak = null) {
  const file = scene.files?.[0] || {};
  const performers = scene.performers?.map(p => p.name).join(", ") || "No performers";
  const studio = scene.studio?.name || "No studio";
  const title = scene.title || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "") || `Scene #${scene.id}`;

  const screenshotPath = scene.paths?.screenshot;
  const previewPath = scene.paths?.preview;
  const stashRating = scene.rating100 ? `${scene.rating100}/100` : "Unrated";

  const rankDisplay = rank != null ? `<span class="hon-scene-rank">${typeof rank === 'number' ? '#' + rank : rank}</span>` : '';
  const streakDisplay = (streak != null && streak > 0) ? `<div class="hon-streak-badge">🔥 ${streak} win${streak > 1 ? 's' : ''}</div>` : '';

  return `
    <div class="hon-scene-card" data-scene-id="${scene.id}" data-side="${side}" data-rating="${scene.rating100 || 50}">
      <div class="hon-scene-image-container" data-scene-url="/scenes/${scene.id}">
        ${screenshotPath ? `<img class="hon-scene-image" src="${screenshotPath}" alt="${title}" loading="lazy" />` : `<div class="hon-scene-image hon-no-image">No Screenshot</div>`}
        ${previewPath ? `<video class="hon-hover-preview" src="${previewPath}" loop playsinline></video>` : ''}
        <div class="hon-scene-duration">${formatDuration(file.duration)}</div>
        ${streakDisplay}
        <div class="hon-click-hint">Click to open scene</div>
      </div>
      <div class="hon-scene-body" data-winner="${scene.id}">
        <div class="hon-scene-info">
          <div class="hon-scene-title-row"><h3 class="hon-scene-title">${title}</h3>${rankDisplay}</div>
          <div class="hon-scene-meta">
            <div class="hon-meta-item"><strong>Studio:</strong> ${studio}</div>
            <div class="hon-meta-item"><strong>Performers:</strong> ${performers}</div>
            <div class="hon-meta-item"><strong>Rating:</strong> ${stashRating}</div>
          </div>
        </div>
        <div class="hon-choose-btn">✓ Choose This Scene</div>
      </div>
    </div>`;
}

export function createPerformerCard(performer, side, rank = null, streak = null) {
  const name = performer.name || `Performer #${performer.id}`;
  const imagePath = performer.image_path || null;
  const stashRating = performer.rating100 ? `${performer.rating100}/100` : "Unrated";

  const rankDisplay = rank != null ? `<span class="hon-performer-rank hon-scene-rank">#${rank}</span>` : '';
  const streakDisplay = (streak != null && streak > 0) ? `<div class="hon-streak-badge">🔥 ${streak} wins</div>` : '';

  return `
    <div class="hon-performer-card hon-scene-card" data-performer-id="${performer.id}" data-side="${side}" data-rating="${performer.rating100 || 50}">
      <div class="hon-performer-image-container hon-scene-image-container">
        <a href="/performers/${performer.id}" target="_blank" class="hon-performer-link">
          ${imagePath ? `<img class="hon-performer-image hon-scene-image" src="${imagePath}" alt="${name}" />` : `<div class="hon-no-image">No Image</div>`}
        </a>
        ${streakDisplay}
      </div>
      <div class="hon-performer-body hon-scene-body" data-winner="${performer.id}">
        <div class="hon-performer-info hon-scene-info">
          <div class="hon-performer-title-row hon-scene-title-row">
            <h3 class="hon-performer-title hon-scene-title">${name}</h3>
            ${rankDisplay}
          </div>
          <div class="hon-performer-meta hon-scene-meta">
            <div class="hon-meta-item"><strong>Country:</strong> ${getCountryDisplay(performer.country)}</div>
            <div class="hon-meta-item"><strong>Gender:</strong> ${getGenderDisplay(performer.gender)}</div>
            <div class="hon-meta-item"><strong>Rating:</strong> ${stashRating}</div>
          </div>
        </div>
        <div class="hon-choose-btn">✓ Choose This Performer</div>
      </div>
    </div>`;
}

export function createImageCard(image, side, rank = null, streak = null) {
  const thumbnailPath = image.paths?.thumbnail || null;
  const rankDisplay = rank != null ? `<span class="hon-image-rank hon-scene-rank">#${rank}</span>` : '';
  const streakDisplay = (streak != null && streak > 0) ? `<div class="hon-streak-badge">🔥 ${streak}</div>` : '';

  return `
    <div class="hon-image-card hon-scene-card" data-image-id="${image.id}" data-side="${side}" data-rating="${image.rating100 || 50}">
      <div class="hon-image-image-container hon-scene-image-container" data-image-url="/images/${image.id}">
        ${thumbnailPath ? `<img class="hon-scene-image" src="${thumbnailPath}" />` : `<div class="hon-no-image">No Image</div>`}
        ${streakDisplay}
        ${rankDisplay ? `<div class="hon-image-rank-overlay">${rankDisplay}</div>` : ''}
      </div>
      <div class="hon-image-body hon-scene-body" data-winner="${image.id}">
        <div class="hon-choose-btn">✓ Choose This Image</div>
      </div>
    </div>`;
}

export function createVictoryScreen(champion) {
  let title, imagePath;

  if (state.battleType === "performers") {
    title = champion.name || `Performer #${champion.id}`;
    imagePath = champion.image_path;
  } else if (state.battleType === "images") {
    title = `Image #${champion.id}`;
    imagePath = champion.paths?.thumbnail || null;
  } else {
    const file = champion.files?.[0] || {};
    title = champion.title
      || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "")
      || `Scene #${champion.id}`;
    imagePath = champion.paths?.screenshot || null;
  }

  return `
    <div class="hon-victory-screen">
      <div class="hon-victory-crown">👑</div>
      <h2 class="hon-victory-title">CHAMPION!</h2>
      <div class="hon-victory-scene">
        ${imagePath
          ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />`
          : `<div class="hon-victory-image hon-no-image">No Image</div>`}
      </div>
      <h3 class="hon-victory-name">${title}</h3>
      <p class="hon-victory-stats">Conquered all ${state.totalItemsCount} with ${state.gauntletWins} wins!</p>
      <button id="hon-new-gauntlet" class="btn btn-primary">Start New Gauntlet</button>
    </div>
  `;
}
