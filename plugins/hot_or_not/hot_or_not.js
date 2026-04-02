(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // state.js
  function resetBattleState() {
    state.gauntletChampion = null;
    state.gauntletWins = 0;
    state.gauntletDefeated = [];
    state.gauntletFalling = false;
    state.gauntletFallingItem = null;
    state.gauntletChampionRank = 0;
    state.matchHistory = [];
    state.skippedId = null;
  }
  var state;
  var init_state = __esm({
    "state.js"() {
      state = {
        // Current Matchup Info
        currentPair: { left: null, right: null },
        currentRanks: { left: null, right: null },
        // App Configuration & Context
        currentMode: "swiss",
        // "swiss", "gauntlet", or "champion"
        battleType: "performers",
        // "performers", "scenes", or "images"
        totalItemsCount: 0,
        disableChoice: false,
        // Gauntlet/Champion Mode Progress
        gauntletChampion: null,
        gauntletWins: 0,
        gauntletChampionRank: 0,
        gauntletDefeated: [],
        gauntletFalling: false,
        gauntletFallingItem: null,
        // Filters & Settings
        cachedUrlFilter: null,
        badgeInjectionInProgress: false,
        pluginConfigCache: null,
        selectedGenders: ["FEMALE"],
        // Enhanced tracking
        matchHistory: [],
        skippedIds: [],
        // Track multiple skipped IDs
        seenPairs: /* @__PURE__ */ new Set(),
        // Track seen performer pairs to prevent repetition
        // Skip tracking
        skippedId: null
        // Keep for backward compatibility but deprecate
      };
    }
  });

  // constants.js
  var ALL_GENDERS, COUNTRY_NAMES, ARRAY_BASED_MODIFIERS;
  var init_constants = __esm({
    "constants.js"() {
      ALL_GENDERS = Object.freeze([
        { value: "FEMALE", label: "Female" },
        { value: "MALE", label: "Male" },
        { value: "TRANSGENDER_MALE", label: "Trans Male" },
        { value: "TRANSGENDER_FEMALE", label: "Trans Female" },
        { value: "INTERSEX", label: "Intersex" },
        { value: "NON_BINARY", label: "Non-Binary" }
      ]);
      COUNTRY_NAMES = Object.freeze({
        "AF": "Afghanistan",
        "AX": "\xC5land Islands",
        "AL": "Albania",
        "DZ": "Algeria",
        "AS": "American Samoa",
        "AD": "Andorra",
        "AO": "Angola",
        "AI": "Anguilla",
        "AQ": "Antarctica",
        "AG": "Antigua and Barbuda",
        "AR": "Argentina",
        "AM": "Armenia",
        "AW": "Aruba",
        "AU": "Australia",
        "AT": "Austria",
        "AZ": "Azerbaijan",
        "BS": "Bahamas",
        "BH": "Bahrain",
        "BD": "Bangladesh",
        "BB": "Barbados",
        "BY": "Belarus",
        "BE": "Belgium",
        "BZ": "Belize",
        "BJ": "Benin",
        "BM": "Bermuda",
        "BT": "Bhutan",
        "BO": "Bolivia",
        "BQ": "Bonaire, Sint Eustatius and Saba",
        "BA": "Bosnia and Herzegovina",
        "BW": "Botswana",
        "BV": "Bouvet Island",
        "BR": "Brazil",
        "IO": "British Indian Ocean Territory",
        "BN": "Brunei Darussalam",
        "BG": "Bulgaria",
        "BF": "Burkina Faso",
        "BI": "Burundi",
        "KH": "Cambodia",
        "CM": "Cameroon",
        "CA": "Canada",
        "CV": "Cape Verde",
        "KY": "Cayman Islands",
        "CF": "Central African Republic",
        "TD": "Chad",
        "CL": "Chile",
        "CN": "People's Republic of China",
        "CX": "Christmas Island",
        "CC": "Cocos (Keeling) Islands",
        "CO": "Colombia",
        "KM": "Comoros",
        "CG": "Republic of the Congo",
        "CD": "Democratic Republic of the Congo",
        "CK": "Cook Islands",
        "CR": "Costa Rica",
        "CI": "Cote d'Ivoire",
        "HR": "Croatia",
        "CU": "Cuba",
        "CW": "Cura\xE7ao",
        "CY": "Cyprus",
        "CZ": "Czech Republic",
        "DK": "Denmark",
        "DJ": "Djibouti",
        "DM": "Dominica",
        "DO": "Dominican Republic",
        "EC": "Ecuador",
        "EG": "Egypt",
        "SV": "El Salvador",
        "GQ": "Equatorial Guinea",
        "ER": "Eritrea",
        "EE": "Estonia",
        "ET": "Ethiopia",
        "SZ": "Eswatini",
        "FK": "Falkland Islands (Malvinas)",
        "FO": "Faroe Islands",
        "FJ": "Fiji",
        "FI": "Finland",
        "FR": "France",
        "GF": "French Guiana",
        "PF": "French Polynesia",
        "TF": "French Southern Territories",
        "GA": "Gabon",
        "GM": "Republic of The Gambia",
        "GE": "Georgia",
        "DE": "Germany",
        "GH": "Ghana",
        "GI": "Gibraltar",
        "GR": "Greece",
        "GL": "Greenland",
        "GD": "Grenada",
        "GP": "Guadeloupe",
        "GU": "Guam",
        "GT": "Guatemala",
        "GG": "Guernsey",
        "GN": "Guinea",
        "GW": "Guinea-Bissau",
        "GY": "Guyana",
        "HT": "Haiti",
        "HM": "Heard Island and McDonald Islands",
        "VA": "Holy See (Vatican City State)",
        "HN": "Honduras",
        "HK": "Hong Kong",
        "HU": "Hungary",
        "IS": "Iceland",
        "IN": "India",
        "ID": "Indonesia",
        "IR": "Islamic Republic of Iran",
        "IQ": "Iraq",
        "IE": "Ireland",
        "IM": "Isle of Man",
        "IL": "Israel",
        "IT": "Italy",
        "JM": "Jamaica",
        "JP": "Japan",
        "JE": "Jersey",
        "JO": "Jordan",
        "KZ": "Kazakhstan",
        "KE": "Kenya",
        "KI": "Kiribati",
        "KP": "North Korea",
        "KR": "South Korea",
        "XK": "Kosovo",
        "KW": "Kuwait",
        "KG": "Kyrgyzstan",
        "LA": "Lao People's Democratic Republic",
        "LV": "Latvia",
        "LB": "Lebanon",
        "LS": "Lesotho",
        "LR": "Liberia",
        "LY": "Libya",
        "LI": "Liechtenstein",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "MO": "Macao",
        "MG": "Madagascar",
        "MW": "Malawi",
        "MY": "Malaysia",
        "MV": "Maldives",
        "ML": "Mali",
        "MT": "Malta",
        "MH": "Marshall Islands",
        "MQ": "Martinique",
        "MR": "Mauritania",
        "MU": "Mauritius",
        "YT": "Mayotte",
        "MX": "Mexico",
        "FM": "Micronesia, Federated States of",
        "MD": "Moldova, Republic of",
        "MC": "Monaco",
        "MN": "Mongolia",
        "ME": "Montenegro",
        "MS": "Montserrat",
        "MA": "Morocco",
        "MZ": "Mozambique",
        "MM": "Myanmar",
        "NA": "Namibia",
        "NR": "Nauru",
        "NP": "Nepal",
        "NL": "Netherlands",
        "NC": "New Caledonia",
        "NZ": "New Zealand",
        "NI": "Nicaragua",
        "NE": "Niger",
        "NG": "Nigeria",
        "NU": "Niue",
        "NF": "Norfolk Island",
        "MK": "North Macedonia",
        "MP": "Northern Mariana Islands",
        "NO": "Norway",
        "OM": "Oman",
        "PK": "Pakistan",
        "PW": "Palau",
        "PS": "State of Palestine",
        "PA": "Panama",
        "PG": "Papua New Guinea",
        "PY": "Paraguay",
        "PE": "Peru",
        "PH": "Philippines",
        "PN": "Pitcairn",
        "PL": "Poland",
        "PT": "Portugal",
        "PR": "Puerto Rico",
        "QA": "Qatar",
        "RE": "Reunion",
        "RO": "Romania",
        "RU": "Russian Federation",
        "RW": "Rwanda",
        "BL": "Saint Barth\xE9lemy",
        "SH": "Saint Helena",
        "KN": "Saint Kitts and Nevis",
        "LC": "Saint Lucia",
        "MF": "Saint Martin (French part)",
        "PM": "Saint Pierre and Miquelon",
        "VC": "Saint Vincent and the Grenadines",
        "WS": "Samoa",
        "SM": "San Marino",
        "ST": "Sao Tome and Principe",
        "SA": "Saudi Arabia",
        "SN": "Senegal",
        "RS": "Serbia",
        "SC": "Seychelles",
        "SL": "Sierra Leone",
        "SG": "Singapore",
        "SX": "Sint Maarten (Dutch part)",
        "SK": "Slovakia",
        "SI": "Slovenia",
        "SB": "Solomon Islands",
        "SO": "Somalia",
        "ZA": "South Africa",
        "GS": "South Georgia and the South Sandwich Islands",
        "SS": "South Sudan",
        "ES": "Spain",
        "LK": "Sri Lanka",
        "SD": "Sudan",
        "SR": "Suriname",
        "SJ": "Svalbard and Jan Mayen",
        "SE": "Sweden",
        "CH": "Switzerland",
        "SY": "Syrian Arab Republic",
        "TW": "Taiwan, Province of China",
        "TJ": "Tajikistan",
        "TZ": "United Republic of Tanzania",
        "TH": "Thailand",
        "TL": "Timor-Leste",
        "TG": "Togo",
        "TK": "Tokelau",
        "TO": "Tonga",
        "TT": "Trinidad and Tobago",
        "TN": "Tunisia",
        "TR": "T\xFCrkiye",
        "TM": "Turkmenistan",
        "TC": "Turks and Caicos Islands",
        "TV": "Tuvalu",
        "UG": "Uganda",
        "UA": "Ukraine",
        "AE": "United Arab Emirates",
        "GB": "United Kingdom",
        "US": "United States of America",
        "UM": "United States Minor Outlying Islands",
        "UY": "Uruguay",
        "UZ": "Uzbekistan",
        "VU": "Vanuatu",
        "VE": "Venezuela",
        "VN": "Vietnam",
        "VG": "Virgin Islands, British",
        "VI": "Virgin Islands, U.S.",
        "WF": "Wallis and Futuna",
        "EH": "Western Sahara",
        "YE": "Yemen",
        "ZM": "Zambia",
        "ZW": "Zimbabwe"
      });
      ARRAY_BASED_MODIFIERS = /* @__PURE__ */ new Set(["INCLUDES", "EXCLUDES", "INCLUDES_ALL"]);
    }
  });

  // formatters.js
  function formatDuration(seconds) {
    if (!seconds)
      return "N/A";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` : `${m}:${s.toString().padStart(2, "0")}`;
  }
  function escapeHtml(unsafe) {
    if (!unsafe)
      return "";
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function getCountryDisplay(countryCode) {
    if (!countryCode)
      return "";
    const code = countryCode.toUpperCase().trim();
    const name = COUNTRY_NAMES[code] || escapeHtml(code);
    const flagClass = `fi fi-${code.toLowerCase().replace(/[^a-z]/g, "")}`;
    return `<span class="${flagClass}"></span> ${name}`;
  }
  var init_formatters = __esm({
    "formatters.js"() {
      init_constants();
    }
  });

  // ui-cards.js
  function getRatingTier(rating) {
    if (rating >= 85)
      return "S-Tier";
    if (rating >= 70)
      return "A-Tier";
    if (rating >= 55)
      return "B-Tier";
    if (rating >= 40)
      return "C-Tier";
    if (rating >= 25)
      return "D-Tier";
    return "F-Tier";
  }
  function getTierColor(tier) {
    switch (tier) {
      case "S-Tier":
        return "#eb9834";
      case "A-Tier":
        return "#e014aa";
      case "B-Tier":
        return "#7f1e82";
      case "C-Tier":
        return "#14bbe0";
      case "D-Tier":
        return "#92e014";
      case "F-Tier":
        return "#808080";
      default:
        return "#000000";
    }
  }
  function formatHeight(heightCm) {
    if (!heightCm)
      return null;
    const totalInches = Math.round(heightCm * 0.393701);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}\u2032${inches}\u2033 (${heightCm} cm)`;
  }
  function renderCard(item, side, rank) {
    const streak = state.gauntletChampion?.id === item.id ? state.gauntletWins : null;
    if (state.battleType === "performers")
      return createPerformerCard(item, side, rank, streak);
    if (state.battleType === "images")
      return createImageCard(item, side, rank, streak);
    return createSceneCard(item, side, rank, streak);
  }
  function createSceneCard(scene, side, rank = null, streak = null) {
    const file = scene.files?.[0] || {};
    const performers = scene.performers?.map((p) => p.name).join(", ") || "No performers";
    const studio = scene.studio?.name || "No studio";
    const title = scene.title || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "") || `Scene #${scene.id}`;
    const screenshotPath = scene.paths?.screenshot;
    const previewPath = scene.paths?.preview;
    const stashRating = scene.rating100 ? (scene.rating100 / 10).toFixed(1) : "Unrated";
    const rankDisplay = rank != null ? `<span class="hon-scene-rank">${typeof rank === "number" ? "#" + rank : rank}</span>` : "";
    const streakDisplay = streak != null && streak > 0 ? `<div class="hon-streak-badge">\u{1F525} ${streak} win${streak > 1 ? "s" : ""}</div>` : "";
    return `
    <div class="hon-scene-card" data-scene-id="${scene.id}" data-side="${side}" data-rating="${scene.rating100 || 50}">
      <div class="hon-scene-image-container" data-scene-url="/scenes/${scene.id}">
        ${screenshotPath ? `<img class="hon-scene-image" src="${screenshotPath}" alt="${title}" loading="lazy" />` : `<div class="hon-scene-image hon-no-image">No Screenshot</div>`}
        ${previewPath ? `<video class="hon-hover-preview" src="${previewPath}" loop playsinline></video>` : ""}
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
        <div class="hon-choose-btn">\u2713 Choose This Scene</div>
      </div>
    </div>`;
  }
  function createPerformerCard(performer, side, rank = null, streak = null) {
    const name = performer.name || `Performer #${performer.id}`;
    const imagePath = performer.image_path || null;
    const rawRating = performer.rating100 ?? 50;
    const stashRating = performer.rating100 !== null ? (rawRating / 10).toFixed(1) : "Unrated";
    let tierDisplay = "";
    if (performer.rating100 !== null) {
      const tier = getRatingTier(rawRating);
      const tierColor = getTierColor(tier);
      tierDisplay = `<span style="font-weight: bold; color: ${tierColor}">${tier}</span> | `;
    }
    let genderIcon = "";
    if (performer.gender) {
      const genderKey = performer.gender.toUpperCase();
      genderIcon = GENDER_ICONS[genderKey] || "\u{1F464}";
    }
    let currentStreakDisplay = "";
    if (performer.custom_fields?.hotornot_stats) {
      try {
        const stats = JSON.parse(performer.custom_fields.hotornot_stats);
        if (stats.current_streak && stats.current_streak > 1) {
          currentStreakDisplay = `
			<div class="hon-current-streak" style="position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; z-index: 10;">
			  Win Streak:\u{1F525}${stats.current_streak} 
			</div>`;
        }
      } catch (e) {
        console.warn(`[HotOrNot] Failed to parse hotornot_stats for performer ${performer.id}:`, e);
      }
    }
    let countsHtml = "";
    const sceneCount = performer.scene_count || 0;
    const galleryCount = performer.gallery_count || 0;
    const imageCount = performer.image_count || 0;
    if (sceneCount > 0 || galleryCount > 0 || imageCount > 0) {
      const sceneDisplay = sceneCount > 0 ? `\u{1F3A5}(${sceneCount})` : "";
      const galleryDisplay = galleryCount > 0 ? `\u{1F5BC}\uFE0F(${galleryCount})` : "";
      const imageDisplay = imageCount > 0 ? `\u{1F4F7}(${imageCount})` : "";
      const countsArray = [sceneDisplay, galleryDisplay, imageDisplay].filter(Boolean);
      if (countsArray.length > 0) {
        countsHtml = ` | ${countsArray.join(" ")}`;
      }
    }
    const metaItems = [];
    metaItems.push(`<div class="hon-meta-item"><strong>Rating:</strong> ${tierDisplay}${stashRating}</div>`);
    if (performer.country) {
      metaItems.push(`<div class="hon-meta-item"><strong>Country:</strong> ${getCountryDisplay(performer.country)}</div>`);
    }
    if (performer.height_cm) {
      const heightFormatted = formatHeight(performer.height_cm);
      if (heightFormatted) {
        metaItems.push(`<div class="hon-meta-item"><strong>Height:</strong> ${heightFormatted}</div>`);
      }
    }
    if (performer.measurements) {
      metaItems.push(`<div class="hon-meta-item"><strong>Measurements:</strong> ${performer.measurements}</div>`);
    }
    if (performer.fake_tits) {
      metaItems.push(`<div class="hon-meta-item"><strong>Fake Tits:</strong> ${performer.fake_tits}</div>`);
    }
    if (performer.tags && performer.tags.length > 0) {
      const tagNames = performer.tags.map((tag) => tag.name || tag);
      const displayedTags = tagNames.slice(0, 3).join(", ");
      const remainingCount = Math.max(0, tagNames.length - 3);
      if (tagNames.length <= 3) {
        metaItems.push(`<div class="hon-meta-item"><strong>Tags:</strong> ${displayedTags}</div>`);
      } else {
        const allTagsHtml = tagNames.join(", ");
        metaItems.push(`
        <div class="hon-meta-item hon-tags-container">
          <strong>Tags:</strong> 
          <span class="hon-tags-displayed">${displayedTags}</span>
          <span class="hon-tags-ellipsis">...</span>
          <span class="hon-tags-more" style="color: #007bff; cursor: pointer; text-decoration: underline;">(+${remainingCount} more)</span>
          <span class="hon-tags-expanded" style="display:none;">${allTagsHtml}</span>
        </div>`);
      }
    }
    const minMetaItems = 6;
    while (metaItems.length < minMetaItems) {
      metaItems.push('<div class="hon-meta-item hon-meta-placeholder">&nbsp;</div>');
    }
    const streakDisplay = streak != null && streak > 0 ? `<div class="hon-streak-badge">\u{1F525} ${streak} wins</div>` : "";
    let badgeHtml = "";
    if (rank != null && rank > 0 && state.totalItemsCount > 0 && rawRating !== 50) {
      const percentile = (state.totalItemsCount - rank + 1) / state.totalItemsCount * 100;
      let tierEmoji = "\u{1F525}";
      if (percentile >= 95)
        tierEmoji = "\u{1F451}";
      else if (percentile >= 80)
        tierEmoji = "\u{1F947}";
      else if (percentile >= 60)
        tierEmoji = "\u{1F948}";
      else if (percentile >= 40)
        tierEmoji = "\u{1F949}";
      badgeHtml = `
      <div class="hon-battle-rank-badge" style="margin-bottom: 8px;">
        <span class="hon-rank-emoji">${tierEmoji}</span>
        <span class="hon-rank-text">Battle Rank #${rank}</span>
        <span class="hon-rank-total">of ${state.totalItemsCount}</span>
      </div>`;
    }
    return `
    <div class="hon-performer-card hon-scene-card" data-performer-id="${performer.id}" data-side="${side}" data-rating="${performer.rating100 || 50}">
      <div class="hon-performer-image-container hon-scene-image-container">
        <a href="/performers/${performer.id}" target="_blank" class="hon-performer-link">
          ${imagePath ? `<img class="hon-performer-image hon-scene-image" src="${imagePath}" alt="${name}" />` : `<div class="hon-no-image">No Image</div>`}
        </a>
        ${currentStreakDisplay}
        ${streakDisplay}
      </div>
      <div class="hon-performer-body hon-scene-body" data-winner="${performer.id}">
        <div class="hon-performer-info hon-scene-info">
          ${badgeHtml}
          <div class="hon-performer-title-row hon-scene-title-row">
            <h3 class="hon-performer-title hon-scene-title">
              ${name} ${genderIcon}${countsHtml}
            </h3>
          </div>
          <div class="hon-performer-meta hon-scene-meta">
            ${metaItems.join("")}
          </div>
        </div>
        <div class="hon-choose-btn">\u2713 Choose This Performer</div>
      </div>
    </div>`;
  }
  function createImageCard(image, side, rank = null, streak = null) {
    const thumbnailPath = image.paths?.thumbnail || null;
    const rankDisplay = rank != null ? `<span class="hon-image-rank hon-scene-rank">#${rank}</span>` : "";
    const streakDisplay = streak != null && streak > 0 ? `<div class="hon-streak-badge">\u{1F525} ${streak}</div>` : "";
    return `
    <div class="hon-image-card hon-scene-card" data-image-id="${image.id}" data-side="${side}" data-rating="${image.rating100 || 50}">
      <div class="hon-image-image-container hon-scene-image-container" data-image-url="/images/${image.id}">
        ${thumbnailPath ? `<img class="hon-scene-image" src="${thumbnailPath}" />` : `<div class="hon-no-image">No Image</div>`}
        ${streakDisplay}
        ${rankDisplay ? `<div class="hon-image-rank-overlay">${rankDisplay}</div>` : ""}
      </div>
      <div class="hon-image-body hon-scene-body" data-winner="${image.id}">
        <div class="hon-choose-btn">\u2713 Choose This Image</div>
      </div>
    </div>`;
  }
  function createVictoryScreen(champion) {
    let title, imagePath;
    if (state.battleType === "performers") {
      title = champion.name || `Performer #${champion.id}`;
      imagePath = champion.image_path;
    } else if (state.battleType === "images") {
      title = `Image #${champion.id}`;
      imagePath = champion.paths?.thumbnail || null;
    } else {
      const file = champion.files?.[0] || {};
      title = champion.title || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "") || `Scene #${champion.id}`;
      imagePath = champion.paths?.screenshot || null;
    }
    return `
    <div class="hon-victory-screen">
      <div class="hon-victory-crown">\u{1F451}</div>
      <h2 class="hon-victory-title">CHAMPION!</h2>
      <div class="hon-victory-scene">
        ${imagePath ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />` : `<div class="hon-victory-image hon-no-image">No Image</div>`}
      </div>
      <h3 class="hon-victory-name">${title}</h3>
      <p class="hon-victory-stats">Conquered all ${state.totalItemsCount} with ${state.gauntletWins} wins!</p>
      <button id="hon-new-gauntlet" class="btn btn-primary">Start New Gauntlet</button>
    </div>
  `;
  }
  var GENDER_ICONS;
  var init_ui_cards = __esm({
    "ui-cards.js"() {
      init_state();
      init_formatters();
      GENDER_ICONS = {
        "FEMALE": "\u2640\uFE0F",
        "MALE": "\u2642\uFE0F",
        "TRANSGENDER_MALE": "\u26A7\uFE0F\u2642\uFE0F",
        "TRANSGENDER_FEMALE": "\u26A7\uFE0F\u2640\uFE0F",
        "INTERSEX": "\u26A5",
        "NON_BINARY": "\u26A7\uFE0F"
      };
    }
  });

  // dom-utils.js
  function clearDOMCache() {
    elementCache.clear();
  }
  var elementCache;
  var init_dom_utils = __esm({
    "dom-utils.js"() {
      elementCache = /* @__PURE__ */ new Map();
    }
  });

  // parsers.js
  function parseUrlFilterCriteria() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const criteriaParams = urlParams.getAll("c");
      if (!criteriaParams || criteriaParams.length === 0) {
        return [];
      }
      const allParsedCriteria = [];
      for (const criteriaParam of criteriaParams) {
        const decoded = decodeURIComponent(criteriaParam);
        try {
          const criteria = JSON.parse(decoded);
          const result = Array.isArray(criteria) ? criteria : [criteria];
          allParsedCriteria.push(...result);
        } catch (e) {
          let normalized = decoded.trim().replace(/\(/g, "{").replace(/\)/g, "}");
          try {
            const criteria = JSON.parse(normalized);
            const result = Array.isArray(criteria) ? criteria : [criteria];
            allParsedCriteria.push(...result);
          } catch (parseErr) {
            const delimiter = "|||SPLIT|||";
            const withDelimiter = normalized.replace(/\}\s*,?\s*\{/g, "}" + delimiter + "{");
            const criteriaStrings = withDelimiter.split(delimiter);
            for (const criteriaStr of criteriaStrings) {
              try {
                const criterion = JSON.parse(criteriaStr.trim());
                if (criterion?.type)
                  allParsedCriteria.push(criterion);
              } catch (splitParseErr) {
                console.warn("[HotOrNot] Could not parse criterion:", criteriaStr);
              }
            }
          }
        }
      }
      return allParsedCriteria;
    } catch (e) {
      console.warn("[HotOrNot] Error parsing URL filter criteria:", e);
      return [];
    }
  }
  function extractSimpleValue(value) {
    if (value === void 0 || value === null)
      return value;
    if (typeof value === "object" && !Array.isArray(value) && value.value !== void 0) {
      return value.value;
    }
    return value;
  }
  function safeParseInt(value, defaultValue = 0) {
    const simpleValue = extractSimpleValue(value);
    if (simpleValue === void 0 || simpleValue === null)
      return defaultValue;
    const parsed = parseInt(simpleValue, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  function normalizeGenderValue(value) {
    if (!value || typeof value !== "string")
      return value;
    const normalized = value.toUpperCase().replace(/[\s-]+/g, "_");
    const validGenders = /* @__PURE__ */ new Set(["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE", "INTERSEX", "NON_BINARY"]);
    if (validGenders.has(normalized))
      return normalized;
    console.warn(`[HotOrNot] Invalid gender value "${value}"`);
    return value;
  }
  function createNumericFilterObject(value, modifier, defaultModifier) {
    const filterObj = {
      value: safeParseInt(value, 0),
      modifier: modifier || defaultModifier
    };
    if (typeof value === "object" && !Array.isArray(value) && value.value2 !== void 0) {
      filterObj.value2 = safeParseInt(value.value2, 0);
    }
    return filterObj;
  }
  function convertCriterionToFilter(criterion) {
    if (!criterion || !criterion.type)
      return null;
    const { type, value, modifier } = criterion;
    switch (type) {
      case "tags":
      case "studios":
        if (value?.items?.length > 0) {
          const ids = value.items.map((item) => typeof item === "object" && item !== null && "id" in item ? item.id : item);
          return {
            [type]: {
              value: ids,
              modifier: modifier || "INCLUDES",
              depth: value.depth || 0
            }
          };
        }
        break;
      case "gender":
        if (value) {
          let genderValue = extractSimpleValue(value);
          if (genderValue) {
            const effectiveModifier = modifier || "EQUALS";
            const useValueList = ARRAY_BASED_MODIFIERS.has(effectiveModifier);
            if (useValueList) {
              const genderArray = Array.isArray(genderValue) ? genderValue : [genderValue];
              return {
                gender: {
                  value_list: genderArray.map((g) => normalizeGenderValue(g)),
                  modifier: effectiveModifier
                }
              };
            } else {
              if (Array.isArray(genderValue))
                genderValue = genderValue[0] || null;
              if (genderValue) {
                return {
                  gender: { value: normalizeGenderValue(genderValue), modifier: effectiveModifier }
                };
              }
            }
          }
        }
        break;
      case "favorite":
      case "filter_favorites":
        if (value !== void 0 && value !== null) {
          const favValue = extractSimpleValue(value);
          return { filter_favorites: favValue === true || favValue === "true" };
        }
        break;
      case "rating":
      case "rating100":
        return value != null ? { rating100: createNumericFilterObject(value, modifier, "GREATER_THAN") } : null;
      case "age":
        return value != null ? { age: createNumericFilterObject(value, modifier, "EQUALS") } : null;
      case "ethnicity":
      case "country":
      case "hair_color":
      case "eye_color":
        if (value) {
          const simpleVal = extractSimpleValue(value);
          if (simpleVal)
            return { [type]: { value: simpleVal, modifier: modifier || "EQUALS" } };
        }
        break;
      case "scene_count":
      case "image_count":
      case "gallery_count":
        return value != null ? { [type]: createNumericFilterObject(value, modifier, "GREATER_THAN") } : null;
      case "o_counter":
        return value != null ? { o_counter: createNumericFilterObject(value, modifier, "GREATER_THAN") } : null;
      case "stash_id":
      case "stash_id_endpoint":
        if (value && typeof value === "object") {
          const stashIdFilter = {};
          if (value.stash_id)
            stashIdFilter.stash_id = value.stash_id;
          if (value.endpoint)
            stashIdFilter.endpoint = value.endpoint;
          if (Object.keys(stashIdFilter).length > 0) {
            stashIdFilter.modifier = modifier || "NOT_NULL";
            return { stash_id_endpoint: stashIdFilter };
          }
        }
        break;
      case "is_missing":
        const missingVal = extractSimpleValue(value);
        return missingVal ? { is_missing: missingVal } : null;
      case "name":
      case "aliases":
      case "details":
      case "career_length":
      case "tattoos":
      case "piercings":
      case "url":
      case "birthdate":
      case "death_date":
      case "created_at":
      case "updated_at":
        const textVal = extractSimpleValue(value);
        const defaultMod = type === "birthdate" || type === "death_date" ? "EQUALS" : type.includes("_at") ? "GREATER_THAN" : "INCLUDES";
        if (textVal)
          return { [type]: { value: textVal, modifier: modifier || defaultMod } };
        break;
      default:
        console.log(`[HotOrNot] Unknown criterion type: ${type}`);
        return null;
    }
    return null;
  }
  function getUrlPerformerFilter() {
    const criteria = parseUrlFilterCriteria();
    const filter = {};
    for (const criterion of criteria) {
      const filterPart = convertCriterionToFilter(criterion);
      if (filterPart)
        Object.assign(filter, filterPart);
    }
    return filter;
  }
  function getPerformerFilter(cachedUrlFilter, selectedGenders) {
    const filter = { ...cachedUrlFilter };
    delete filter.gender;
    if (selectedGenders.length > 0) {
      filter.gender = { value_list: selectedGenders, modifier: "INCLUDES" };
    }
    const hasOtherFilters = Object.keys(cachedUrlFilter || {}).some((k) => k !== "gender");
    if (!hasOtherFilters && !filter.NOT) {
      filter.NOT = { is_missing: "image" };
    }
    return filter;
  }
  var init_parsers = __esm({
    "parsers.js"() {
      init_constants();
    }
  });

  // math-utils.js
  function getRecencyWeight(performer) {
    const stats = parsePerformerEloData(performer);
    const baseWeight = 0.1;
    if (!stats.last_match)
      return 0.9;
    const lastMatchDate = new Date(stats.last_match);
    if (isNaN(lastMatchDate.getTime())) {
      console.warn(`[HotOrNot] Invalid last_match date for performer ${performer.id}: ${stats.last_match}`);
      return 0.9;
    }
    const hoursSince = (Date.now() - lastMatchDate.getTime()) / (1e3 * 60 * 60);
    const safeHoursSince = Math.max(0, hoursSince);
    const matches = stats.total_matches || 0;
    const experienceFactor = Math.max(0.5, 1 - matches / 100);
    const timeFactor = Math.min(1, 1 - Math.exp(-0.5 * safeHoursSince));
    const finalWeight = Math.max(0.1, baseWeight * experienceFactor + timeFactor * (1 - experienceFactor));
    return finalWeight;
  }
  function weightedRandomSelect(items, weights) {
    if (!items?.length || items.length !== weights?.length)
      return null;
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0)
      return items[Math.floor(Math.random() * items.length)];
    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0)
        return items[i];
    }
    return items[items.length - 1];
  }
  function parsePerformerEloData(performer) {
    const defaultStats = {
      total_matches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      current_streak: 0,
      best_streak: 0,
      worst_streak: 0,
      last_match: null
    };
    if (!performer?.custom_fields)
      return defaultStats;
    if (performer.custom_fields.hotornot_stats) {
      try {
        const stats = JSON.parse(performer.custom_fields.hotornot_stats);
        return { ...defaultStats, ...stats };
      } catch (e) {
        console.warn(`[HotOrNot] Failed to parse stats for ${performer.id}`);
      }
    }
    const eloMatches = parseInt(performer.custom_fields.elo_matches, 10);
    if (!isNaN(eloMatches))
      return { ...defaultStats, total_matches: eloMatches };
    return defaultStats;
  }
  function updatePerformerStats(currentStats, won) {
    const newStats = {
      ...currentStats,
      total_matches: (currentStats.total_matches || 0) + 1,
      last_match: (/* @__PURE__ */ new Date()).toISOString()
    };
    delete newStats.history;
    if (won === null) {
      newStats.draws = (currentStats.draws || 0) + 1;
      return newStats;
    }
    newStats.wins = won ? (currentStats.wins || 0) + 1 : currentStats.wins || 0;
    newStats.losses = won ? currentStats.losses || 0 : (currentStats.losses || 0) + 1;
    newStats.current_streak = won ? currentStats.current_streak >= 0 ? (currentStats.current_streak || 0) + 1 : 1 : currentStats.current_streak <= 0 ? (currentStats.current_streak || 0) - 1 : -1;
    newStats.best_streak = Math.max(currentStats.best_streak || 0, newStats.current_streak);
    newStats.worst_streak = Math.min(currentStats.worst_streak || 0, newStats.current_streak);
    return newStats;
  }
  function getKFactor(currentRating, matchCount = null, mode = "swiss") {
    let baseK;
    if (matchCount !== null) {
      baseK = matchCount < 10 ? 16 : matchCount < 30 ? 12 : 8;
    } else {
      const dist = Math.abs(currentRating - 50);
      baseK = dist < 10 ? 12 : dist < 25 ? 10 : 8;
    }
    let kFactor = mode === "champion" ? Math.max(1, Math.round(baseK * 0.5)) : baseK;
    const ratingMultiplier = getRatingTierMultiplier(currentRating);
    kFactor = Math.round(kFactor * ratingMultiplier);
    return Math.max(1, kFactor);
  }
  function isActiveParticipant(performerId, mode, gauntletChampion, gauntletFallingItem) {
    if (mode === "swiss" || mode === "champion")
      return true;
    if (mode === "gauntlet") {
      return true;
    }
    return false;
  }
  function getUnderdogMultiplier(rating, opponentRating) {
    const ratingDiff = opponentRating - rating;
    if (ratingDiff > 30)
      return 2.5;
    if (ratingDiff > 20)
      return 2;
    if (ratingDiff > 10)
      return 1.5;
    return 1;
  }
  function calculateMatchOutcome({
    winnerRating,
    loserRating,
    mode,
    winnerMatchCount,
    loserMatchCount,
    isChampionWinner,
    isFallingWinner,
    isChampionLoser,
    isFallingLoser,
    loserRank,
    winnerStats = {},
    loserStats = {},
    isSpecialChallenge = false,
    specialChallengeRules = null
  }) {
    console.log(`[DEBUG] Match calculation: ${loserRating} vs ${winnerRating}`);
    const ratingDiff = loserRating - winnerRating;
    const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 400));
    const winnerK = getProgressiveKFactor(winnerRating, loserRating, winnerMatchCount, mode, winnerStats);
    const loserK = getProgressiveKFactor(loserRating, winnerRating, loserMatchCount, mode, loserStats);
    console.log(`[DEBUG] K-factors - Winner: ${winnerK}, Loser: ${loserK}`);
    let winnerGain = 0;
    let loserLoss = 0;
    if (mode === "gauntlet") {
      const kFactor = getProgressiveKFactor(winnerRating, loserRating, winnerMatchCount, "gauntlet", winnerStats);
      const underdogMultiplier = getUnderdogMultiplier(winnerRating, loserRating);
      if (isChampionWinner || isFallingWinner) {
        winnerGain = Math.max(0, Math.round(kFactor * (1 - expectedWinner) * underdogMultiplier));
      }
      if (isChampionLoser || isFallingLoser) {
        loserLoss = Math.max(0, Math.round(kFactor * expectedWinner));
      }
      if (loserRank === 1 && !isChampionLoser && !isFallingLoser) {
        loserLoss = 1;
      }
    } else {
      const winnerUnderdogMultiplier = getUnderdogMultiplier(winnerRating, loserRating);
      const loserUnderdogMultiplier = getUnderdogMultiplier(loserRating, winnerRating);
      console.log(`[DEBUG] Underdog multipliers - Winner: ${winnerUnderdogMultiplier}, Loser: ${loserUnderdogMultiplier}`);
      let loserProtection = 1;
      if (isSpecialChallenge && specialChallengeRules) {
        loserProtection = 0.1;
        console.log(`[DEBUG] Special challenge protection applied: ${loserProtection}`);
      } else {
        loserProtection = getChallengeProtectionMultiplier(loserRating, winnerRating);
        console.log(`[DEBUG] Regular challenge protection: ${loserProtection}`);
      }
      winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner) * winnerUnderdogMultiplier));
      loserLoss = Math.max(0, Math.round(loserK * expectedWinner * loserUnderdogMultiplier * loserProtection));
      console.log(`[DEBUG] Raw calculations - Winner gain: ${winnerGain}, Loser loss: ${loserLoss}`);
      if (isSpecialChallenge && specialChallengeRules) {
        winnerGain = Math.round(winnerGain * specialChallengeRules.bonusMultiplier);
        loserLoss = Math.min(loserLoss, specialChallengeRules.maxLossPoints);
        console.log(`[DEBUG] Special challenge final - Winner gain: ${winnerGain}, Loser loss: ${loserLoss}`);
      }
    }
    winnerGain = applyDiminishingReturns(winnerGain, winnerRating, winnerStats);
    loserLoss = applyDiminishingReturns(loserLoss, loserRating, loserStats);
    const ratingGap = winnerRating - loserRating;
    if (ratingGap > 25) {
      loserLoss = Math.min(loserLoss, 2);
      console.log(`[PROTECTION] Large rating gap loss capped at 2 points`);
    } else if (ratingGap > 20 && !isSpecialChallenge) {
      loserLoss = Math.min(loserLoss, 3);
      console.log(`[PROTECTION] Cross-tier loss capped at 3 points`);
    }
    console.log(`[DEBUG] Final results - Winner gain: ${winnerGain}, Loser loss: ${loserLoss}`);
    return { winnerGain, loserLoss };
  }
  function getProgressiveKFactor(rating, opponentRating, matchCount, mode, stats = {}) {
    let baseK;
    if (matchCount !== null) {
      baseK = matchCount < 10 ? 16 : matchCount < 30 ? 12 : 8;
    } else {
      const dist = Math.abs(rating - 50);
      baseK = dist < 10 ? 12 : dist < 25 ? 10 : 8;
    }
    let kFactor = mode === "champion" ? Math.max(1, Math.round(baseK * 0.5)) : baseK;
    const ratingDifference = Math.abs(rating - opponentRating);
    if (ratingDifference > 25) {
      if (rating < opponentRating) {
        kFactor *= 1.8;
      } else {
        kFactor *= 0.6;
      }
    }
    const ratingMultiplier = getRatingTierMultiplier(rating);
    kFactor *= ratingMultiplier;
    const veteranMultiplier = getVeteranMultiplier(stats.total_matches || 0);
    kFactor *= veteranMultiplier;
    const streakMultiplier = getStreakMultiplier(stats.current_streak || 0);
    kFactor *= streakMultiplier;
    return Math.min(32, Math.max(1, Math.round(kFactor)));
  }
  function getRatingTierMultiplier(rating) {
    if (rating >= 90)
      return 0.6;
    if (rating >= 85)
      return 0.7;
    if (rating >= 80)
      return 0.8;
    if (rating >= 75)
      return 0.9;
    return 1;
  }
  function getVeteranMultiplier(totalMatches) {
    if (totalMatches > 150)
      return 0.7;
    if (totalMatches > 100)
      return 0.8;
    if (totalMatches > 50)
      return 0.9;
    return 1;
  }
  function getStreakMultiplier(streak) {
    if (Math.abs(streak) > 15)
      return 0.7;
    if (Math.abs(streak) > 10)
      return 0.8;
    if (Math.abs(streak) > 5)
      return 0.9;
    return 1;
  }
  function applyDiminishingReturns(points, rating, stats) {
    let multiplier = 1;
    if (rating > 90) {
      multiplier *= 0.7;
    } else if (rating > 85) {
      multiplier *= 0.8;
    } else if (rating > 80) {
      multiplier *= 0.9;
    }
    const achievementMultiplier = getAchievementMultiplier(stats, rating);
    multiplier *= achievementMultiplier;
    return Math.round(points * multiplier);
  }
  function getAchievementMultiplier(stats, rating) {
    let mult = 1;
    if (stats.total_matches > 150)
      mult *= 0.8;
    else if (stats.total_matches > 100)
      mult *= 0.9;
    if (rating > 90)
      mult *= 0.8;
    else if (rating > 85)
      mult *= 0.9;
    const absStreak = Math.abs(stats.current_streak || 0);
    if (absStreak > 20)
      mult *= 0.8;
    else if (absStreak > 10)
      mult *= 0.9;
    return Math.max(0.5, mult);
  }
  function getChallengeProtectionMultiplier(rating, opponentRating) {
    const ratingDiff = opponentRating - rating;
    if (ratingDiff > 15) {
      if (ratingDiff > 30) {
        return 0.1;
      } else if (ratingDiff > 25) {
        return 0.2;
      } else if (ratingDiff > 20) {
        return 0.3;
      } else {
        return 0.4;
      }
    }
    return 1;
  }
  var init_math_utils = __esm({
    "math-utils.js"() {
    }
  });

  // api-client.js
  var api_client_exports = {};
  __export(api_client_exports, {
    IMAGE_FRAGMENT: () => IMAGE_FRAGMENT,
    PERFORMER_FRAGMENT: () => PERFORMER_FRAGMENT,
    SCENE_FRAGMENT: () => SCENE_FRAGMENT,
    fetchAllPerformerStats: () => fetchAllPerformerStats,
    fetchImageCount: () => fetchImageCount,
    fetchPerformerById: () => fetchPerformerById,
    fetchPerformerCount: () => fetchPerformerCount,
    fetchRandomImages: () => fetchRandomImages,
    fetchRandomPerformers: () => fetchRandomPerformers,
    fetchRandomScenes: () => fetchRandomScenes,
    fetchSceneCount: () => fetchSceneCount,
    getHotOrNotConfig: () => getHotOrNotConfig,
    getPerformerBattleRank: () => getPerformerBattleRank,
    graphqlQuery: () => graphqlQuery,
    handleComparison: () => handleComparison,
    isBattleRankBadgeEnabled: () => isBattleRankBadgeEnabled,
    undoLastMatch: () => undoLastMatch,
    updateImageRating: () => updateImageRating,
    updateItemRating: () => updateItemRating,
    updatePerformerRating: () => updatePerformerRating,
    updateSceneRating: () => updateSceneRating
  });
  async function graphqlQuery(query, variables = {}) {
    if (typeof PluginApi !== "undefined" && PluginApi.utils?.StashService?.getClient && PluginApi.libraries?.Apollo) {
      try {
        const { gql } = PluginApi.libraries.Apollo;
        const client = PluginApi.utils.StashService.getClient();
        const doc = gql(query);
        const isMutation = doc.definitions.some((def) => def.kind === "OperationDefinition" && def.operation === "mutation");
        const result2 = isMutation ? await client.mutate({ mutation: doc, variables }) : await client.query({ query: doc, variables, fetchPolicy: "no-cache" });
        return result2.data;
      } catch (e) {
        console.warn("[HotOrNot] Apollo fallback to fetch:", e.message);
      }
    }
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables })
    });
    const result = await response.json();
    if (result.errors) {
      const errorMessages = result.errors.map((error) => error.message).join("; ");
      throw new Error(`GraphQL Errors: ${errorMessages}`);
    }
    return result.data;
  }
  async function fetchSceneCount() {
    const result = await graphqlQuery(`query { findScenes(filter: { per_page: 0 }) { count } }`);
    return result.findScenes.count;
  }
  async function fetchRandomScenes(count = 2) {
    const total = await fetchSceneCount();
    const result = await graphqlQuery(`query($f: FindFilterType) { findScenes(filter: $f) { scenes { ${SCENE_FRAGMENT} } } }`, {
      f: { per_page: Math.min(100, total), sort: "random" }
    });
    return (result.findScenes.scenes || []).sort(() => Math.random() - 0.5).slice(0, count);
  }
  async function fetchPerformerById(id) {
    const result = await graphqlQuery(`query($id: ID!) { findPerformer(id: $id) { ${PERFORMER_FRAGMENT} } }`, { id });
    return result.findPerformer;
  }
  async function fetchPerformerCount(filter = {}) {
    const result = await graphqlQuery(`query($f: PerformerFilterType) { findPerformers(performer_filter: $f, filter: { per_page: 0 }) { count } }`, { f: filter });
    return result.findPerformers.count;
  }
  async function fetchRandomImages(count = 2) {
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
  async function handleComparison(winnerId, loserId, winnerCurrentRating, loserCurrentRating, loserRank = null, winnerObj = null, loserObj = null, isDraw = false) {
    const winnerRating = winnerCurrentRating || 50;
    const loserRating = loserCurrentRating || 50;
    let freshWinnerObj = winnerObj;
    let freshLoserObj = loserObj;
    if (state.battleType === "performers" && (!winnerObj || !loserObj)) {
      const [fetchedWinner, fetchedLoser] = await Promise.all([
        winnerId && !winnerObj ? fetchPerformerById(winnerId) : Promise.resolve(winnerObj),
        loserId && !loserObj ? fetchPerformerById(loserId) : Promise.resolve(loserObj)
      ]);
      freshWinnerObj = fetchedWinner || winnerObj;
      freshLoserObj = fetchedLoser || loserObj;
    } else {
      freshWinnerObj = winnerObj || freshWinnerObj;
      freshLoserObj = loserObj || freshLoserObj;
    }
    let winnerMatchCount = 0;
    let loserMatchCount = 0;
    let winnerStats = {};
    let loserStats = {};
    if (state.battleType === "performers") {
      winnerStats = parsePerformerEloData(freshWinnerObj) || {};
      loserStats = parsePerformerEloData(freshLoserObj) || {};
      winnerMatchCount = winnerStats.total_matches || 0;
      loserMatchCount = loserStats.total_matches || 0;
    }
    let winnerGain = 0;
    let loserLoss = 0;
    if (isDraw) {
      const ratingDiff2 = loserRating - winnerRating;
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff2 / 400));
      const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
      const loserK = getKFactor(loserRating, loserMatchCount, "swiss");
      winnerGain = Math.round(winnerK * (0.5 - expectedWinner));
      loserLoss = Math.round(loserK * (1 - expectedWinner - 0.5));
    } else {
      const isChampionWinner = !!state.gauntletChampion && winnerId === state.gauntletChampion.id;
      const isFallingWinner = state.gauntletFalling && !!state.gauntletFallingItem && winnerId === state.gauntletFallingItem.id;
      const isChampionLoser = !!state.gauntletChampion && loserId === state.gauntletChampion.id;
      const isFallingLoser = state.gauntletFalling && !!state.gauntletFallingItem && loserId === state.gauntletFallingItem.id;
      ({ winnerGain, loserLoss } = calculateMatchOutcome({
        winnerRating,
        loserRating,
        mode: state.currentMode,
        winnerMatchCount,
        loserMatchCount,
        isChampionWinner,
        isFallingWinner,
        isChampionLoser,
        isFallingLoser,
        loserRank,
        winnerStats,
        loserStats,
        isSpecialChallenge: state.currentPair?.isSpecialChallenge || false,
        specialChallengeRules: state.currentPair?.specialChallengeRules || null
      }));
    }
    const newWinnerRating = Math.min(100, Math.max(1, winnerRating + winnerGain));
    const newLoserRating = Math.min(100, Math.max(1, loserRating - loserLoss));
    const isFirstMatchGlobal = (state.currentMode === "gauntlet" || state.currentMode === "champion") && !state.gauntletChampion;
    const shouldTrackWinner = state.battleType === "performers" && (state.currentMode === "gauntlet" || state.currentMode === "champion" || isActiveParticipant(winnerId, state.currentMode, state.gauntletChampion, state.gauntletFallingItem) || isFirstMatchGlobal);
    const shouldTrackLoser = state.battleType === "performers" && (state.currentMode === "gauntlet" || state.currentMode === "champion" || isActiveParticipant(loserId, state.currentMode, state.gauntletChampion, state.gauntletFallingItem) || isFirstMatchGlobal);
    const winnerStatus = isDraw ? null : true;
    const loserStatus = isDraw ? null : false;
    const winnerOldStats = shouldTrackWinner && freshWinnerObj ? {
      ...parsePerformerEloData(freshWinnerObj),
      performer_record: freshWinnerObj.custom_fields?.performer_record
    } : null;
    const loserOldStats = shouldTrackLoser && freshLoserObj ? {
      ...parsePerformerEloData(freshLoserObj),
      performer_record: freshLoserObj.custom_fields?.performer_record
    } : null;
    function normalizeStatsForStorage(stats) {
      if (!stats || !stats.performer_record)
        return stats;
      let normalizedStats = { ...stats };
      try {
        if (typeof normalizedStats.performer_record === "string") {
          normalizedStats.performer_record = JSON.parse(normalizedStats.performer_record);
        }
      } catch (e) {
        console.warn("[HotOrNot] Failed to parse performer_record for storage:", e);
      }
      return normalizedStats;
    }
    const normalizedWinnerStats = winnerOldStats ? normalizeStatsForStorage(winnerOldStats) : null;
    const normalizedLoserStats = loserOldStats ? normalizeStatsForStorage(loserOldStats) : null;
    if (!state.matchHistory)
      state.matchHistory = [];
    state.matchHistory.push({
      winnerId,
      loserId,
      winnerOldRating: winnerRating,
      loserOldRating: loserRating,
      winnerOldStats: normalizedWinnerStats,
      loserOldStats: normalizedLoserStats,
      pairSnapshot: {
        left: state.currentPair.left ? { ...state.currentPair.left } : null,
        right: state.currentPair.right ? { ...state.currentPair.right } : null,
        rankLeft: state.currentRanks.left,
        rankRight: state.currentRanks.right
      },
      gauntletSnapshot: {
        gauntletChampion: state.gauntletChampion ? { ...state.gauntletChampion } : null,
        gauntletWins: state.gauntletWins,
        gauntletDefeated: [...state.gauntletDefeated || []],
        gauntletFalling: state.gauntletFalling,
        gauntletFallingItem: state.gauntletFallingItem ? { ...state.gauntletFallingItem } : null
      }
    });
    if (state.matchHistory.length > 10)
      state.matchHistory.shift();
    if (!winnerId || !loserId) {
      console.error("[HotOrNot] Cannot update rating: One or both IDs are missing", { winnerId, loserId });
      return { newWinnerRating, newLoserRating, winnerChange: winnerGain, loserChange: -loserLoss };
    }
    await updateItemRating(
      winnerId,
      newWinnerRating,
      shouldTrackWinner ? freshWinnerObj : null,
      winnerStatus,
      loserId
      // Pass the ID instead of the potentially null object
    );
    await updateItemRating(
      loserId,
      newLoserRating,
      shouldTrackLoser ? freshLoserObj : null,
      loserStatus,
      winnerId
      // Pass the ID instead of the potentially null object
    );
    return {
      newWinnerRating,
      newLoserRating,
      winnerChange: winnerGain,
      loserChange: -loserLoss
    };
  }
  async function updateItemRating(itemId, newRating, itemObj = null, won = null, opponentId = null) {
    if (state.battleType === "performers") {
      return await updatePerformerRating(itemId, newRating, itemObj, won, opponentId);
    } else if (state.battleType === "images") {
      return await updateImageRating(itemId, newRating);
    } else {
      return await updateSceneRating(itemId, newRating);
    }
  }
  async function fetchRandomPerformers(count = 2) {
    if (state.selectedGenders.length === 0) {
      throw new Error("No genders selected.");
    }
    const battleGender = state.selectedGenders[Math.floor(Math.random() * state.selectedGenders.length)];
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
  async function fetchImageCount() {
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
  async function fetchAllPerformerStats() {
    const allPerformers = [];
    let currentPage = 1;
    const pageSize = 1e3;
    while (true) {
      const result = await graphqlQuery(`
      query FindAllPerformers($filter: FindFilterType) {
        findPerformers(filter: $filter) {
          performers { ${PERFORMER_FRAGMENT} }
        }
      }
    `, {
        filter: {
          per_page: pageSize,
          page: currentPage,
          sort: "rating",
          direction: "DESC"
        }
      });
      const performers = result.findPerformers.performers || [];
      if (performers.length === 0) {
        break;
      }
      allPerformers.push(...performers);
      if (performers.length < pageSize) {
        break;
      }
      currentPage++;
    }
    return allPerformers.sort((a, b) => (b.rating100 ?? 50) - (a.rating100 ?? 50));
  }
  async function updateSceneRating(id, rating) {
    await graphqlQuery(`mutation($i: SceneUpdateInput!) { sceneUpdate(input: $i) { id } }`, {
      i: { id, rating100: Math.max(1, Math.min(100, rating)) }
    });
  }
  async function updateImageRating(id, rating) {
    await graphqlQuery(`mutation($i: ImageUpdateInput!) { imageUpdate(input: $i) { id } }`, {
      i: { id, rating100: Math.max(1, Math.min(100, rating)) }
    });
  }
  async function updatePerformerRating(id, rating, performerObj = null, won = null, opponentId = null) {
    const variables = { id, rating: Math.round(rating), fields: {} };
    if (performerObj) {
      const currentStats = parsePerformerEloData(performerObj);
      const updatedStats = updatePerformerStats(currentStats, won);
      variables.fields.hotornot_stats = JSON.stringify(updatedStats);
      let matchHistory = [];
      try {
        const rawRecord = performerObj.custom_fields?.performer_record;
        console.log(`[HotOrNot] Raw performer_record for ${id}:`, rawRecord);
        if (rawRecord) {
          matchHistory = typeof rawRecord === "string" ? JSON.parse(rawRecord) : rawRecord;
        }
      } catch (e) {
        console.error(`[HotOrNot] Failed to parse performer_record:`, e);
        matchHistory = [];
      }
      let opponentData = "0:Unknown";
      if (opponentId) {
        if (typeof opponentId === "string" && opponentId.includes(":")) {
          opponentData = opponentId;
        } else if (typeof opponentId === "string" || typeof opponentId === "number") {
          let cleanId = opponentId.toString().replace(/^.*?(\d+).*$/, "$1");
          if (cleanId && cleanId !== "0") {
            let opponentName = "Unknown";
            if (state.currentPair) {
              if (state.currentPair.left && state.currentPair.left.id == cleanId) {
                opponentName = state.currentPair.left.name || `Performer #${cleanId}`;
              } else if (state.currentPair.right && state.currentPair.right.id == cleanId) {
                opponentName = state.currentPair.right.name || `Performer #${cleanId}`;
              }
            }
            if (opponentName === "Unknown" && state.gauntletChampion && state.gauntletChampion.id == cleanId) {
              opponentName = state.gauntletChampion.name || `Performer #${cleanId}`;
            }
            if (opponentName === "Unknown") {
              try {
                const opponentPerformer = await fetchPerformerById(cleanId);
                if (opponentPerformer) {
                  opponentName = opponentPerformer.name || `Performer #${cleanId}`;
                }
              } catch (e) {
                console.warn(`[HotOrNot] Failed to fetch opponent ${cleanId}:`, e);
              }
            }
            opponentData = `${cleanId}:${opponentName}`;
          }
        } else if (typeof opponentId === "object") {
          const oppId = opponentId.id || "0";
          let oppName = opponentId.name || "Unknown";
          if (oppName === "Unknown") {
            if (state.currentPair) {
              if (opponentId === state.currentPair.left) {
                oppName = state.currentPair.left.name || `Performer #${oppId}`;
              } else if (opponentId === state.currentPair.right) {
                oppName = state.currentPair.right.name || `Performer #${oppId}`;
              }
            }
            if (oppName === "Unknown" && state.gauntletChampion && opponentId === state.gauntletChampion) {
              oppName = state.gauntletChampion.name || `Performer #${oppId}`;
            }
          }
          if (oppName === "Unknown" && oppId && oppId !== "0") {
            try {
              const opponentPerformer = await fetchPerformerById(oppId);
              if (opponentPerformer) {
                oppName = opponentPerformer.name || `Performer #${oppId}`;
              }
            } catch (e) {
              console.warn(`[HotOrNot] Failed to fetch opponent ${oppId}:`, e);
            }
          }
          if (oppId && oppId !== "0") {
            opponentData = `${oppId}:${oppName}`;
          }
        }
      }
      matchHistory.push({
        date: (/* @__PURE__ */ new Date()).toISOString(),
        opponent: opponentData,
        won,
        ratingAfter: Math.round(rating)
      });
      console.log(`[HotOrNot] New match history for ${id}:`, matchHistory);
      if (matchHistory.length > 30)
        matchHistory = matchHistory.slice(-30);
      variables.fields.performer_record = JSON.stringify(matchHistory);
    }
    console.log(`[HotOrNot] Updating performer ${id} with variables:`, variables);
    await graphqlQuery(`
    mutation($id: ID!, $rating: Int!, $fields: Map) {
      performerUpdate(input: { 
        id: $id, 
        rating100: $rating, 
        custom_fields: { partial: $fields } 
      }) { 
        id 
      }
    }`, variables);
  }
  async function undoLastMatch() {
    if (!state.matchHistory || state.matchHistory.length === 0) {
      console.log("[HotOrNot] No match history to undo");
      return null;
    }
    const last = state.matchHistory.pop();
    console.log("[HotOrNot] Undoing match:", last);
    try {
      await Promise.all([
        updateItemRatingDirect(last.winnerId, last.winnerOldRating, last.winnerOldStats),
        updateItemRatingDirect(last.loserId, last.loserOldRating, last.loserOldStats)
      ]);
      console.log("[HotOrNot] Successfully restored ratings");
    } catch (error) {
      state.matchHistory.push(last);
      console.error("[HotOrNot] Failed to restore ratings:", error);
      throw new Error(`Failed to undo match: ${error.message}`);
    }
    if (last.gauntletSnapshot) {
      const snap = last.gauntletSnapshot;
      state.gauntletChampion = snap.gauntletChampion;
      state.gauntletWins = snap.gauntletWins;
      state.gauntletDefeated = [...snap.gauntletDefeated];
      state.gauntletFalling = snap.gauntletFalling;
      state.gauntletFallingItem = snap.gauntletFallingItem;
      console.log("[HotOrNot] Restored gauntlet state");
    }
    let restoredPairSnapshot = null;
    if (last.pairSnapshot) {
      const { left, right } = last.pairSnapshot;
      state.currentPair = { left, right };
      state.currentRanks = { left: last.pairSnapshot.rankLeft, right: last.pairSnapshot.rankRight };
      restoredPairSnapshot = last.pairSnapshot;
      console.log("[HotOrNot] Restored pair snapshot");
    }
    return restoredPairSnapshot || null;
  }
  async function updateItemRatingDirect(itemId, rating, statsObj) {
    if (state.battleType === "performers") {
      const fields = {};
      if (statsObj) {
        fields.hotornot_stats = JSON.stringify(statsObj);
        if ("performer_record" in statsObj) {
          const recordData = statsObj.performer_record;
          console.log(`[HotOrNot] Restoring performer_record for ${itemId}:`, recordData);
          if (recordData !== void 0 && recordData !== null) {
            fields.performer_record = Array.isArray(recordData) ? JSON.stringify(recordData) : recordData;
          } else {
            fields.performer_record = "[]";
          }
        }
      }
      console.log(`[HotOrNot] Restoring performer ${itemId} with fields:`, fields);
      await graphqlQuery(`
      mutation($id: ID!, $rating: Int!, $fields: Map) {
        performerUpdate(input: { 
          id: $id, 
          rating100: $rating, 
          custom_fields: { partial: $fields } 
        }) { 
          id 
        }
      }`, {
        id: itemId,
        rating: Math.round(rating),
        fields
      });
    } else if (state.battleType === "images") {
      await updateImageRating(itemId, rating);
    } else {
      await updateSceneRating(itemId, rating);
    }
  }
  async function getHotOrNotConfig() {
    if (pluginConfigCache)
      return pluginConfigCache;
    const result = await graphqlQuery(`query { configuration { plugins } }`);
    pluginConfigCache = (result.configuration.plugins || {})["HotOrNot"] || {};
    return pluginConfigCache;
  }
  async function isBattleRankBadgeEnabled() {
    const config = await getHotOrNotConfig();
    return config.showBattleRankBadge !== false;
  }
  async function getPerformerBattleRank(performerId) {
    try {
      const target = await fetchPerformerById(performerId);
      if (!target || target.rating100 === null || target.rating100 === 50)
        return null;
      const currentRating = target.rating100;
      const rankResult = await graphqlQuery(`
      query GetRankCount($rating: Int!) {
        findPerformers(performer_filter: { rating100: { value: $rating, modifier: GREATER_THAN } }) {
          count
        }
        totalRated: findPerformers(performer_filter: { rating100: { value: 0, modifier: GREATER_THAN } }) {
          count
        }
      }
    `, { rating: currentRating });
      const rank = (rankResult.findPerformers.count || 0) + 1;
      const total = rankResult.totalRated.count || 0;
      let stats = null;
      const statsJson = target.custom_fields?.["hotornot_stats"];
      if (statsJson) {
        stats = typeof statsJson === "string" ? JSON.parse(statsJson) : statsJson;
      }
      return { rank, total, rating: currentRating, stats };
    } catch (err) {
      console.error("[HotOrNot] Error calculating rank:", err);
      return null;
    }
  }
  var SCENE_FRAGMENT, PERFORMER_FRAGMENT, IMAGE_FRAGMENT, pluginConfigCache;
  var init_api_client = __esm({
    "api-client.js"() {
      init_parsers();
      init_math_utils();
      init_state();
      SCENE_FRAGMENT = `id title date rating100 paths { screenshot preview } files { duration path } studio { name } performers { name } tags { name }`;
      PERFORMER_FRAGMENT = `id name image_path rating100 details custom_fields birthdate ethnicity country gender height_cm measurements fake_tits scene_count image_count gallery_count tags { name }`;
      IMAGE_FRAGMENT = `id rating100 paths { thumbnail image }`;
      pluginConfigCache = null;
    }
  });

  // gauntlet-selection.js
  var gauntlet_selection_exports = {};
  __export(gauntlet_selection_exports, {
    fetchPerformersForSelection: () => fetchPerformersForSelection,
    hidePerformerSelection: () => hidePerformerSelection,
    loadPerformerSelection: () => loadPerformerSelection,
    showPerformerSelection: () => showPerformerSelection,
    showPlacementScreen: () => showPlacementScreen
  });
  async function fetchPerformersForSelection(count = 5) {
    const filter = getPerformerFilter(state.cachedUrlFilter, state.selectedGenders);
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
  function createSelectionCard(performer) {
    const name = performer.name || `Performer #${performer.id}`;
    const rating = performer.rating100 ? `${performer.rating100}/100` : "Unrated";
    return `
    <div class="hon-selection-card" data-performer-id="${performer.id}">
      <div class="hon-selection-image-container">
        ${performer.image_path ? `<img class="hon-selection-image" src="${performer.image_path}" alt="${name}" loading="lazy" />` : `<div class="hon-selection-image hon-no-image">No Image</div>`}
      </div>
      <div class="hon-selection-info">
        <h4 class="hon-selection-name">${name}</h4>
        <div class="hon-selection-rating">${rating}</div>
      </div>
    </div>`;
  }
  async function loadPerformerSelection() {
    const listEl = document.getElementById("hon-performer-list");
    if (!listEl)
      return;
    try {
      const performers = await fetchPerformersForSelection(5);
      listEl.innerHTML = performers.map((p) => createSelectionCard(p)).join("");
      listEl.querySelectorAll(".hon-selection-card").forEach((card) => {
        card.onclick = () => {
          const selected = performers.find((p) => p.id.toString() === card.dataset.performerId);
          if (selected)
            startGauntletWithPerformer(selected);
        };
      });
    } catch (err) {
      listEl.innerHTML = `<div class="hon-error">Error: ${err.message}</div>`;
    }
  }
  function startGauntletWithPerformer(performer) {
    resetBattleState();
    state.gauntletChampion = performer;
    state.gauntletWins = 0;
    state.gauntletFalling = false;
    const sel = document.getElementById("hon-performer-selection");
    const comp = document.getElementById("hon-comparison-area");
    const actions = document.querySelector(".hon-actions");
    if (sel)
      sel.style.display = "none";
    if (comp)
      comp.style.display = "";
    if (actions)
      actions.style.display = "";
    loadNewPair();
  }
  function showPerformerSelection() {
    const selectionContainer = document.getElementById("hon-performer-selection");
    const comparisonArea = document.getElementById("hon-comparison-area");
    const actionsEl = document.querySelector(".hon-actions");
    if (selectionContainer) {
      selectionContainer.style.display = "block";
      loadPerformerSelection();
    }
    if (comparisonArea)
      comparisonArea.style.display = "none";
    if (actionsEl)
      actionsEl.style.display = "none";
    const modal = document.getElementById("hon-modal");
    if (modal) {
      modal.classList.remove("hon-mode-champion", "hon-mode-swiss");
      modal.classList.add("hon-mode-gauntlet");
    }
  }
  function hidePerformerSelection() {
    const selectionContainer = document.getElementById("hon-performer-selection");
    const comparisonArea = document.getElementById("hon-comparison-area");
    const actionsEl = document.querySelector(".hon-actions");
    if (selectionContainer)
      selectionContainer.style.display = "none";
    if (comparisonArea)
      comparisonArea.style.display = "";
    if (actionsEl)
      actionsEl.style.display = "";
    const modal = document.getElementById("hon-modal");
    if (modal) {
      modal.classList.remove("hon-mode-gauntlet");
      modal.classList.add(`hon-mode-${state.currentMode}`);
    }
  }
  function showPlacementScreen(item, rank, finalRating) {
    const comparisonArea = document.getElementById("hon-comparison-area");
    if (!comparisonArea)
      return;
    let title, imagePath;
    if (state.battleType === "performers") {
      title = item.name || `Performer #${item.id}`;
      imagePath = item.image_path;
    } else if (state.battleType === "images") {
      title = `Image #${item.id}`;
      imagePath = item.paths && item.paths.thumbnail ? item.paths.thumbnail : null;
    } else {
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
        <div class="hon-victory-crown">\u{1F4CD}</div>
        <h2 class="hon-victory-title">PLACED!</h2>
        <div class="hon-victory-scene">
          ${imagePath ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />` : `<div class="hon-victory-image hon-no-image">No Image</div>`}
        </div>
        <h3 class="hon-victory-name">${title}</h3>
        <p class="hon-victory-stats">
          Rank <strong>#${rank}</strong> of ${state.totalItemsCount}<br>
          Rating: <strong>${finalRating}/100</strong>
        </p>
        <button id="hon-new-gauntlet" class="btn btn-primary">Start New Run</button>
      </div>
    `;
    const statusEl = document.getElementById("hon-gauntlet-status");
    const actionsEl = document.querySelector(".hon-actions");
    if (statusEl)
      statusEl.style.display = "none";
    if (actionsEl)
      actionsEl.style.display = "none";
    resetBattleState();
    const newBtn = comparisonArea.querySelector("#hon-new-gauntlet");
    if (newBtn) {
      newBtn.addEventListener("click", () => {
        if (actionsEl)
          actionsEl.style.display = "";
        loadNewPair();
      });
    }
  }
  var init_gauntlet_selection = __esm({
    "gauntlet-selection.js"() {
      init_api_client();
      init_parsers();
      init_state();
      init_battle_engine();
    }
  });

  // match-handler.js
  var match_handler_exports = {};
  __export(match_handler_exports, {
    handleChooseItem: () => handleChooseItem,
    handleSkip: () => handleSkip,
    handleUndo: () => handleUndo
  });
  async function handleChooseItem(event) {
    if (state.disableChoice)
      return;
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
    if (state.battleType === "images") {
      const outcome2 = await handleComparison(winnerId, loserId, winnerRating, loserRating, null, winnerItem, loserItem);
      applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome2);
      return;
    }
    if (state.currentMode === "gauntlet") {
      if (state.gauntletFalling && state.gauntletFallingItem) {
        if (winnerId === state.gauntletFallingItem.id) {
          const finalRating = Math.min(100, loserRating + 1);
          await handleComparison(
            winnerId,
            // falling item (now winner)
            loserId,
            // the opponent they beat
            winnerRating,
            loserRating,
            null,
            // no rank for placement matches
            winnerItem,
            loserItem,
            false
            // not a draw
          );
          const finalRank = Math.max(1, (loserRank || 1) - 1);
          applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, { newWinnerRating: finalRating, newLoserRating: loserRating, winnerChange: 0, loserChange: 0 });
          setTimeout(() => showPlacementScreen2(winnerItem, finalRank, finalRating, state.battleType, state.totalItemsCount), 800);
        } else {
          state.gauntletDefeated.push(winnerId);
          const outcome3 = await handleComparison(
            winnerId,
            // winner (the challenger)
            state.gauntletFallingItem.id,
            // loser (the falling item)
            winnerRating,
            loserRating,
            null,
            // no rank for falling matches
            winnerItem,
            loserItem,
            // loserItem is the falling item
            false
            // not a draw
          );
          applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome3);
        }
        return;
      }
      const outcome2 = await handleComparison(winnerId, loserId, winnerRating, loserRating, loserRank, winnerItem, loserItem);
      updateGauntletState(winnerId, winnerItem, loserId, loserItem, outcome2.newWinnerRating);
      applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome2);
      return;
    }
    if (state.currentMode === "champion") {
      const outcome2 = await handleComparison(winnerId, loserId, winnerRating, loserRating, loserRank, winnerItem, loserItem);
      updateChampionModeState(winnerId, winnerItem, loserId, outcome2.newWinnerRating);
      applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome2);
      return;
    }
    const outcome = await handleComparison(winnerId, loserId, winnerRating, loserRating, null, winnerItem, loserItem);
    applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome);
  }
  function updateGauntletState(winnerId, winnerItem, loserId, loserItem, newWinnerRating) {
    if (state.gauntletChampion?.id === winnerId) {
      state.gauntletDefeated.push(loserId);
      state.gauntletWins++;
      state.gauntletChampion.rating100 = newWinnerRating;
    } else {
      if (!state.gauntletFalling) {
        console.log(`[HotOrNot] Champion ${loserItem.name} defeated. Entering placement phase.`);
        state.gauntletFalling = true;
        state.gauntletFallingItem = loserItem;
        state.gauntletDefeated = [winnerId];
      } else {
        state.gauntletDefeated.push(winnerId);
      }
    }
  }
  function updateChampionModeState(winnerId, winnerItem, loserId, newWinnerRating) {
    if (state.gauntletChampion?.id === winnerId) {
      state.gauntletDefeated.push(loserId);
      state.gauntletWins++;
      state.gauntletChampion.rating100 = newWinnerRating;
    } else {
      state.gauntletChampion = winnerItem;
      state.gauntletWins = 1;
    }
  }
  async function handleSkip() {
    const left = state.currentPair?.left;
    const right = state.currentPair?.right;
    if (left && right) {
      const pairKey = [left.id, right.id].sort().join("-");
      state.seenPairs.add(pairKey);
      if (state.seenPairs.size > 1e3) {
        const pairsArray = Array.from(state.seenPairs);
        state.seenPairs = new Set(pairsArray.slice(500));
      }
      const leftRating = left.rating100 || 50;
      const rightRating = right.rating100 || 50;
      await handleComparison(
        left.id,
        right.id,
        leftRating,
        rightRating,
        null,
        left,
        right,
        true
        // isDraw
      );
    }
    if (state.currentMode === "gauntlet" && right) {
      state.skippedIds.push(right.id);
      if (state.skippedIds.length > 10) {
        state.skippedIds.shift();
      }
      console.log(`[HotOrNot] Skipping Gauntlet opponent: ${right.name}`);
    }
    loadNewPair();
  }
  async function handleUndo() {
    if (!state.matchHistory || state.matchHistory.length === 0) {
      console.log("[HotOrNot] Nothing to undo.");
      return;
    }
    const undoBtn = document.getElementById("hon-undo-btn");
    if (undoBtn) {
      undoBtn.disabled = true;
      undoBtn.textContent = "Undoing\u2026";
    }
    try {
      console.log("[HotOrNot] Starting undo operation...");
      const pairSnapshot = await undoLastMatch();
      if (pairSnapshot?.left && pairSnapshot?.right) {
        console.log("[HotOrNot] Re-rendering previous pair from snapshot");
        const { renderCard: renderCard2 } = await Promise.resolve().then(() => (init_ui_manager(), ui_manager_exports));
        const { attachBattleListeners: attachBattleListeners2 } = await Promise.resolve().then(() => (init_battle_engine(), battle_engine_exports));
        const area = document.getElementById("hon-comparison-area");
        if (area) {
          state.disableChoice = false;
          area.innerHTML = `
		<div class="hon-vs-container">
		  ${renderCard2(pairSnapshot.left, "left", pairSnapshot.rankLeft)}
		  <div class="hon-vs-divider"><span>VS</span></div>
		  ${renderCard2(pairSnapshot.right, "right", pairSnapshot.rankRight)}
		</div>
	  `;
          attachBattleListeners2(area);
        }
        console.log("[HotOrNot] Undo successful \u2014 previous pair restored.");
      } else {
        console.log("[HotOrNot] No snapshot available, loading fresh pair");
        loadNewPair();
      }
    } catch (err) {
      console.error("[HotOrNot] Undo failed:", err);
      const area = document.getElementById("hon-comparison-area");
      if (area) {
        area.innerHTML = `<div class="hon-error">Undo failed: ${err.message}</div>`;
      }
      setTimeout(() => {
        loadNewPair();
      }, 2e3);
    } finally {
      const btn = document.getElementById("hon-undo-btn");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "\u21A9 Undo";
        btn.style.display = state.matchHistory && state.matchHistory.length > 0 ? "inline-block" : "none";
      }
    }
  }
  function applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome) {
    winnerCard.classList.add("hon-winner");
    if (loserCard)
      loserCard.classList.add("hon-loser");
    showRatingAnimation(winnerCard, winnerRating, outcome.newWinnerRating, outcome.winnerChange, true);
    if (loserCard) {
      showRatingAnimation(loserCard, loserRating, outcome.newLoserRating, outcome.loserChange, false);
    }
    setTimeout(() => {
      const isVictoryVisible = document.querySelector(".hon-victory-screen");
      if (!isVictoryVisible) {
        loadNewPair();
      } else {
        console.log("[HotOrNot] Victory screen detected, cancelling next pair load.");
      }
    }, 1500);
  }
  var init_match_handler = __esm({
    "match-handler.js"() {
      init_state();
      init_api_client();
      init_ui_manager();
      init_battle_engine();
      init_ui_manager();
    }
  });

  // battle-engine.js
  var battle_engine_exports = {};
  __export(battle_engine_exports, {
    attachBattleListeners: () => attachBattleListeners,
    fetchChampionPairPerformers: () => fetchChampionPairPerformers,
    fetchChampionPairScenes: () => fetchChampionPairScenes,
    fetchGauntletPairPerformers: () => fetchGauntletPairPerformers,
    fetchGauntletPairScenes: () => fetchGauntletPairScenes,
    fetchPair: () => fetchPair,
    fetchSwissPairImages: () => fetchSwissPairImages,
    fetchSwissPairPerformers: () => fetchSwissPairPerformers,
    fetchSwissPairScenes: () => fetchSwissPairScenes,
    handleMatchmakingLogic: () => handleMatchmakingLogic,
    loadNewPair: () => loadNewPair
  });
  function attachBattleListeners(area) {
    area.querySelectorAll(".hon-scene-body").forEach((body) => {
      body.onclick = (e) => handleChooseItem(e);
    });
    area.querySelectorAll(".hon-scene-card").forEach((card) => {
      const video = card.querySelector(".hon-hover-preview");
      if (!video)
        return;
      card.onmouseenter = () => video.play().catch(() => {
      });
      card.onmouseleave = () => {
        video.pause();
        video.currentTime = 0;
      };
    });
    area.querySelectorAll(".hon-tags-more").forEach((tagElement) => {
      tagElement.onclick = function(e) {
        e.stopPropagation();
        const container = this.parentElement;
        const displayedTags = container.querySelector(".hon-tags-displayed");
        const ellipsis = container.querySelector(".hon-tags-ellipsis");
        const moreLink = this;
        const expandedTags = container.querySelector(".hon-tags-expanded");
        if (displayedTags)
          displayedTags.style.display = "none";
        if (ellipsis)
          ellipsis.style.display = "none";
        moreLink.style.display = "none";
        if (expandedTags)
          expandedTags.style.display = "inline";
      };
    });
  }
  async function fetchPair() {
    const { battleType, currentMode } = state;
    if (currentMode === "swiss") {
      if (battleType === "performers")
        return await fetchSwissPairPerformers(state.selectedGenders);
      if (battleType === "images")
        return await fetchSwissPairImages();
      return await fetchSwissPairScenes();
    }
    if (currentMode === "gauntlet") {
      if (battleType === "performers")
        return await fetchGauntletPairPerformers();
      if (battleType === "images")
        return await fetchSwissPairImages();
      return await fetchGauntletPairScenes();
    }
    if (currentMode === "champion") {
      if (battleType === "performers")
        return await fetchChampionPairPerformers();
      if (battleType === "images")
        return await fetchSwissPairImages();
      return await fetchChampionPairScenes();
    }
  }
  async function loadNewPair() {
    state.disableChoice = false;
    const area = document.getElementById("hon-comparison-area");
    if (!area)
      return;
    const undoBtn = document.getElementById("hon-undo-btn");
    if (undoBtn) {
      undoBtn.style.display = state.matchHistory && state.matchHistory.length > 0 ? "inline-block" : "none";
      undoBtn.disabled = false;
      undoBtn.textContent = "\u21A9 Undo";
    }
    if (state.currentMode === "gauntlet" && state.battleType === "performers" && !state.gauntletChampion && !state.gauntletFalling) {
      showPerformerSelection();
      return;
    }
    try {
      const result = await fetchPair();
      if (result.isVictory) {
        area.innerHTML = createVictoryScreen(result.items[0], state.battleType, state.gauntletWins, state.totalItemsCount);
        attachVictoryHandlers(area);
        return;
      }
      if (result.isPlacement) {
        showPlacementScreen(result.items[0], result.placementRank, result.placementRating);
        return;
      }
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
  function shouldForceCrossTierMatch() {
    return Math.random() < 0.15;
  }
  function getCrossTierOpponent(allPerformers, targetPerformer) {
    const targetRating = targetPerformer.rating100 || 50;
    const crossTierCandidates = allPerformers.filter(
      (p) => p.id !== targetPerformer.id && (p.rating100 || 50) >= targetRating + 20
    );
    if (crossTierCandidates.length > 0) {
      return crossTierCandidates[Math.floor(Math.random() * crossTierCandidates.length)];
    }
    return null;
  }
  function createSpecialChallengeOpportunity(performer, allPerformers) {
    const stats = parsePerformerEloData(performer);
    if (stats.total_matches > 50 && Math.abs(stats.current_streak) > 10) {
      const targets = allPerformers.filter(
        (p) => p.id !== performer.id && (p.rating100 || 50) > (performer.rating100 || 50) + 15
      );
      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        return {
          performer,
          target,
          isSpecialChallenge: true,
          // Protective rules for special challenges
          maxLossPoints: 2,
          // Maximum points loser can lose
          bonusMultiplier: 2
          // Extra bonus for taking the challenge
        };
      }
    }
    return null;
  }
  function attachVictoryHandlers(area) {
    const btn = area.querySelector("#hon-new-gauntlet");
    if (btn) {
      btn.onclick = () => {
        resetBattleState();
        if (state.currentMode === "gauntlet" && state.battleType === "performers") {
          Promise.resolve().then(() => (init_gauntlet_selection(), gauntlet_selection_exports)).then((m) => m.showPerformerSelection());
        } else {
          loadNewPair();
        }
      };
    }
  }
  async function fetchSwissPairImages() {
    const totalImages = await fetchImageCount();
    const useSampling = totalImages > 1e3;
    const sampleSize = useSampling ? Math.min(500, totalImages) : totalImages;
    const query = `query FindImagesByRating($filter: FindFilterType) {
    findImages(filter: $filter) { images { ${IMAGE_FRAGMENT} } }
  }`;
    const result = await graphqlQuery(query, {
      filter: {
        per_page: sampleSize,
        sort: useSampling ? "random" : "rating",
        direction: useSampling ? void 0 : "DESC"
      }
    });
    const images = result.findImages.images || [];
    if (images.length < 2)
      return { items: await fetchRandomImages(2), ranks: [null, null] };
    const image1 = images[Math.floor(Math.random() * images.length)];
    const rating1 = image1.rating100 || 50;
    const matchWindow = images.length > 50 ? 10 : 20;
    const similar = images.filter((s) => s.id !== image1.id && Math.abs((s.rating100 || 50) - rating1) <= matchWindow);
    const image2 = similar.length > 0 ? similar[Math.floor(Math.random() * similar.length)] : images.filter((s) => s.id !== image1.id)[0];
    return {
      items: [image1, image2],
      ranks: useSampling ? [null, null] : [images.indexOf(image1) + 1, images.indexOf(image2) + 1]
    };
  }
  async function fetchSwissPairScenes() {
    const result = await graphqlQuery(`query FindScenesByRating($filter: FindFilterType) {
    findScenes(filter: $filter) { scenes { ${SCENE_FRAGMENT} } }
  }`, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const scenes = result.findScenes.scenes || [];
    if (scenes.length < 2)
      return { items: await fetchRandomScenes(2), ranks: [null, null] };
    const scene1 = scenes[Math.floor(Math.random() * scenes.length)];
    const rating1 = scene1.rating100 || 50;
    const matchWindow = scenes.length > 50 ? 10 : 20;
    const similar = scenes.filter((s) => s.id !== scene1.id && Math.abs((s.rating100 || 50) - rating1) <= matchWindow);
    const scene2 = similar.length > 0 ? similar[Math.floor(Math.random() * similar.length)] : scenes.find((s) => s.id !== scene1.id);
    return { items: [scene1, scene2], ranks: [scenes.indexOf(scene1) + 1, scenes.indexOf(scene2) + 1] };
  }
  async function fetchGauntletPairScenes() {
    const result = await graphqlQuery(`query FindScenesByRating($filter: FindFilterType) {
    findScenes(filter: $filter) { count, scenes { ${SCENE_FRAGMENT} } }
  }`, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const scenes = result.findScenes.scenes || [];
    state.totalItemsCount = result.findScenes.count || scenes.length;
    if (scenes.length < 2)
      return { items: await fetchRandomScenes(2), ranks: [null, null], isVictory: false };
    return handleMatchmakingLogic(scenes, "scenes");
  }
  async function fetchSwissPairPerformers() {
    const performerFilter = getPerformerFilter(state.cachedUrlFilter, state.selectedGenders);
    const result = await graphqlQuery(`query FindPerformersByRating($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) { count, performers { ${PERFORMER_FRAGMENT} } }
  }`, { performer_filter: performerFilter, filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const performers = result.findPerformers.performers || [];
    state.totalItemsCount = result.findPerformers.count || performers.length;
    if (performers.length < 2)
      return { items: await fetchRandomPerformers(2), ranks: [null, null] };
    const firstPerformer = performers[Math.floor(Math.random() * performers.length)];
    const specialChallengeResult = createSpecialChallengeOpportunity(firstPerformer, performers);
    if (specialChallengeResult) {
      return {
        items: [specialChallengeResult.performer, specialChallengeResult.target],
        ranks: [
          performers.findIndex((p) => p.id === specialChallengeResult.performer.id) + 1,
          performers.findIndex((p) => p.id === specialChallengeResult.target.id) + 1
        ],
        isSpecialChallenge: true,
        specialChallengeRules: specialChallengeResult
      };
    }
    if (shouldForceCrossTierMatch()) {
      const targetPerformer = performers[Math.floor(Math.random() * performers.length)];
      const crossTierOpponent = getCrossTierOpponent(performers, targetPerformer);
      if (crossTierOpponent) {
        return {
          items: [targetPerformer, crossTierOpponent],
          ranks: [
            performers.findIndex((p) => p.id === targetPerformer.id) + 1,
            performers.findIndex((p) => p.id === crossTierOpponent.id) + 1
          ]
        };
      }
    }
    const weightedList = performers.map((p, idx) => {
      const recencyWeight = getRecencyWeight(p);
      return { p, weight: recencyWeight, idx };
    });
    const s1 = weightedRandomSelect(weightedList, weightedList.map((item) => item.weight));
    const recentlySelectedThreshold = 2;
    const s1LastMatchDate = new Date(parsePerformerEloData(s1.p).last_match);
    const s1HoursAgo = (Date.now() - s1LastMatchDate.getTime()) / (1e3 * 60 * 60);
    let availablePerformers = performers.filter((p) => {
      if (p.id === s1.p.id)
        return false;
      const pStats = parsePerformerEloData(p);
      if (!pStats.last_match)
        return true;
      const pLastMatchDate = new Date(pStats.last_match);
      const pHoursAgo = (Date.now() - pLastMatchDate.getTime()) / (1e3 * 60 * 60);
      if (s1HoursAgo < 1 && pHoursAgo < 1) {
        return Math.random() > 0.8;
      }
      return true;
    });
    const rating1 = s1.p.rating100 || 50;
    const dynamicWindow = calculateDynamicWindow(rating1, performers.length);
    const similar = availablePerformers.filter(
      (p) => Math.abs((p.rating100 || 50) - rating1) <= dynamicWindow
    );
    let s2;
    if (similar.length > 0) {
      const weightedSimilar = similar.map((p) => ({
        p,
        weight: getRecencyWeight(p) * getRatingProximityWeight(rating1, p.rating100 || 50)
      }));
      s2 = weightedRandomSelect(weightedSimilar, weightedSimilar.map((item) => item.weight));
    } else {
      if (availablePerformers.length > 0) {
        const weightedOthers = availablePerformers.map((p) => ({
          p,
          weight: getRecencyWeight(p)
        }));
        s2 = weightedRandomSelect(weightedOthers, weightedOthers.map((item) => item.weight));
      } else {
        s2 = { p: performers.find((p) => p.id !== s1.p.id) };
      }
    }
    let leftRank = null;
    let rightRank = null;
    if (s1.p.rating100 !== null && s1.p.rating100 !== 50) {
      leftRank = s1.idx + 1;
    }
    const rightPerformer = s2?.p || performers.find((p) => p.id !== s1.p.id);
    if (rightPerformer && rightPerformer.rating100 !== null && rightPerformer.rating100 !== 50) {
      rightRank = performers.findIndex((p) => p.id === rightPerformer.id) + 1;
    }
    console.log(`[HotOrNot] Selected matchup: ${s1.p.name} vs ${rightPerformer?.name}`);
    console.log(`[HotOrNot] Weights used - ${s1.p.name}: ${getRecencyWeight(s1.p).toFixed(3)}, ${rightPerformer?.name}: ${rightPerformer ? getRecencyWeight(rightPerformer).toFixed(3) : "N/A"}`);
    return {
      items: [s1.p, rightPerformer],
      ranks: [leftRank, rightRank]
    };
  }
  function calculateDynamicWindow(rating, totalPerformers) {
    const percentile = getRatingPercentile(rating, totalPerformers);
    if (percentile >= 90)
      return 15;
    if (percentile >= 50)
      return 30;
    if (percentile >= 10)
      return 50;
    return 65;
  }
  function getRatingProximityWeight(rating1, rating2) {
    const diff = Math.abs(rating1 - rating2);
    return Math.exp(-diff / 35);
  }
  function getRatingPercentile(rating, totalPerformers) {
    return Math.max(1, Math.min(99, rating));
  }
  async function fetchGauntletPairPerformers() {
    const gender = state.gauntletChampion?.gender || state.selectedGenders[0];
    const performerFilter = getPerformerFilter(state.cachedUrlFilter, [gender]);
    const result = await graphqlQuery(`query FindPerformersByRating($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) { count, performers { ${PERFORMER_FRAGMENT} } }
  }`, { performer_filter: performerFilter, filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const performers = result.findPerformers.performers || [];
    state.totalItemsCount = performers.length;
    if (performers.length < 2)
      return { items: await fetchRandomPerformers(2), ranks: [null, null], isVictory: false };
    return handleMatchmakingLogic(performers, "performers");
  }
  async function fetchChampionPairPerformers() {
    const performerFilter = getPerformerFilter(state.cachedUrlFilter, state.selectedGenders);
    const result = await graphqlQuery(`query FindPerformersByRating($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) { performers { ${PERFORMER_FRAGMENT} } }
  }`, { performer_filter: performerFilter, filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const performers = result.findPerformers.performers || [];
    state.totalItemsCount = performers.length;
    if (performers.length < 2)
      return { items: await fetchRandomPerformers(2), ranks: [null, null] };
    if (!state.gauntletChampion) {
      const shuffled = [...performers].sort(() => Math.random() - 0.5);
      return { items: [shuffled[0], shuffled[1]], ranks: [null, null] };
    }
    return handleMatchmakingLogic(performers, "performers");
  }
  async function fetchChampionPairScenes() {
    const result = await graphqlQuery(`query FindScenesByRating($filter: FindFilterType) {
    findScenes(filter: $filter) { count, scenes { ${SCENE_FRAGMENT} } }
  }`, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const scenes = result.findScenes.scenes || [];
    state.totalItemsCount = result.findScenes.count || scenes.length;
    if (scenes.length < 2)
      return { items: await fetchRandomScenes(2), ranks: [null, null] };
    if (!state.gauntletChampion) {
      const shuffled = [...scenes].sort(() => Math.random() - 0.5);
      return { items: [shuffled[0], shuffled[1]], ranks: [null, null] };
    }
    return handleMatchmakingLogic(scenes, "scenes");
  }
  function handleMatchmakingLogic(list, type) {
    if (!state.gauntletChampion) {
      console.warn("[HotOrNot] No champion selected, picking a random starter.");
      const randomStarter = list[Math.floor(Math.random() * list.length)];
      let candidate = list.find((i) => i.id !== randomStarter.id);
      if (state.seenPairs && state.seenPairs.size > 0) {
        const candidates = list.filter(
          (i) => i.id !== randomStarter.id && !hasBeenRecentlyPaired(randomStarter.id, i.id)
        );
        if (candidates.length > 0) {
          candidate = candidates[Math.floor(Math.random() * candidates.length)];
        }
      }
      return {
        items: [randomStarter, candidate || list.find((i) => i.id !== randomStarter.id)],
        ranks: [null, null],
        isVictory: false
      };
    }
    const champIdx = list.findIndex((i) => i.id === state.gauntletChampion.id);
    let potentialOpponents = list.filter(
      (item, idx) => idx < champIdx && !state.gauntletDefeated.includes(item.id) && !state.skippedIds.includes(item.id) && // Don't rematch skipped opponents
      !hasBeenRecentlyPaired(state.gauntletChampion.id, item.id)
      // Avoid recent pairs
    );
    if (potentialOpponents.length === 0) {
      if (state.skippedIds.length > 0) {
        state.skippedIds = [];
        return handleMatchmakingLogic(list, type);
      }
      return { items: [state.gauntletChampion], ranks: [1], isVictory: true };
    }
    const proximityWindow = Math.min(5, potentialOpponents.length);
    let filteredOpponents = potentialOpponents.slice(-proximityWindow).filter(
      (opponent) => !hasBeenRecentlyPaired(state.gauntletChampion.id, opponent.id)
    );
    if (filteredOpponents.length === 0) {
      filteredOpponents = potentialOpponents.slice(-proximityWindow);
    }
    const randomIdx = Math.floor(Math.random() * filteredOpponents.length);
    const nextOpponent = filteredOpponents[randomIdx];
    const pairKey = [state.gauntletChampion.id, nextOpponent.id].sort().join("-");
    if (state.seenPairs) {
      state.seenPairs.add(pairKey);
    }
    return {
      items: [state.gauntletChampion, nextOpponent],
      ranks: [champIdx + 1, list.indexOf(nextOpponent) + 1],
      isVictory: false
    };
  }
  function hasBeenRecentlyPaired(id1, id2) {
    if (!state.seenPairs)
      return false;
    const pairKey = [id1, id2].sort().join("-");
    return state.seenPairs.has(pairKey);
  }
  var init_battle_engine = __esm({
    "battle-engine.js"() {
      init_api_client();
      init_math_utils();
      init_parsers();
      init_state();
      init_ui_manager();
      init_gauntlet_selection();
      init_match_handler();
    }
  });

  // ui-stats.js
  var ui_stats_exports = {};
  __export(ui_stats_exports, {
    createStatsModalContent: () => createStatsModalContent,
    generateBarGroups: () => generateBarGroups,
    generateStatTables: () => generateStatTables,
    openStatsModal: () => openStatsModal
  });
  async function openStatsModal() {
    const existingStatsModal = document.getElementById("hon-stats-modal");
    if (existingStatsModal)
      existingStatsModal.remove();
    const statsModal = document.createElement("div");
    statsModal.id = "hon-stats-modal";
    statsModal.className = "hon-stats-modal";
    statsModal.innerHTML = `
    <div class="hon-modal-backdrop"></div>
    <div class="hon-stats-modal-dialog">
      <button class="hon-modal-close">\u2715</button>
      <div class="hon-stats-loading">Loading stats...</div>
    </div>
  `;
    document.body.appendChild(statsModal);
    const closeStats = () => statsModal.remove();
    const dialogContainer = statsModal.querySelector(".hon-stats-modal-dialog");
    dialogContainer.addEventListener("click", (e) => e.stopPropagation());
    statsModal.querySelector(".hon-modal-backdrop").addEventListener("click", closeStats);
    statsModal.querySelector(".hon-modal-close").addEventListener("click", closeStats);
    try {
      const performers = await fetchAllPerformerStats();
      const content = createStatsModalContent(performers);
      dialogContainer.innerHTML = `
      <button class="hon-modal-close">\u2715</button>
      ${content}
    `;
      dialogContainer.addEventListener("click", (e) => e.stopPropagation());
      dialogContainer.querySelector(".hon-modal-close").addEventListener("click", closeStats);
      initStatsTabs(dialogContainer);
      initStatsCollapsibles(dialogContainer);
    } catch (error) {
      console.error("[HotOrNot] Error loading stats:", error);
      dialogContainer.innerHTML = `
      <button class="hon-modal-close">\u2715</button>
      <div class="hon-stats-error">Failed to load statistics.</div>
    `;
      dialogContainer.querySelector(".hon-modal-close").addEventListener("click", closeStats);
    }
  }
  function createStatsModalContent(performers) {
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
    performers.forEach((p) => {
      const r = p.rating100 ?? 50;
      if (r >= 0 && r <= 100)
        ratingBuckets[r]++;
    });
    return `
    <div class="hon-stats-header">
      <h2>\u{1F4CA} Performer Statistics</h2>
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
  function generateStatTables(processedPerformers) {
    const groups = [];
    const groupSize = 250;
    for (let i = 0; i < processedPerformers.length; i += groupSize) {
      const chunk = processedPerformers.slice(i, i + groupSize);
      const startRank = i + 1;
      const endRank = Math.min(i + groupSize, processedPerformers.length);
      const rows = chunk.map((p) => {
        const winRate = p.total_matches > 0 ? (p.wins / p.total_matches * 100).toFixed(1) : "N/A";
        const streakDisplay = p.current_streak > 0 ? `<span class="hon-stats-positive">+${p.current_streak}</span>` : p.current_streak < 0 ? `<span class="hon-stats-negative">${p.current_streak}</span>` : "0";
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
      }).join("");
      groups.push(`
      <div class="hon-rank-group">
        <div class="hon-rank-group-header" data-group="${i}" role="button">
          <span class="hon-group-toggle">\u25B6</span>
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
    return groups.join("");
  }
  function generateBarGroups(ratingBuckets) {
    const totalPerformers = ratingBuckets.reduce((s, c) => s + c, 0);
    const maxBucket = Math.max(...ratingBuckets, 1);
    const isClustered = totalPerformers > 0 && maxBucket / totalPerformers > 0.5;
    if (isClustered) {
      const grouped = [];
      for (let i = 0; i <= 100; i += 5) {
        const count = ratingBuckets.slice(i, i + 5).reduce((s, c) => s + c, 0);
        grouped.push({ label: `${i}\u2013${Math.min(i + 4, 100)}`, count });
      }
      const groupMax = Math.max(...grouped.map((g) => g.count), 1);
      return grouped.map(({ label, count }) => {
        if (count === 0)
          return "";
        const percentage = count / groupMax * 100;
        return `
        <div class="hon-bar-container" title="Rating ${label}: ${count} performers">
          <div class="hon-bar-label" style="min-width:60px">${label}</div>
          <div class="hon-bar-wrapper">
            <div class="hon-bar" style="width: ${percentage}%">
              ${count > 2 ? `<span class="hon-bar-count">${count}</span>` : ""}
            </div>
          </div>
        </div>`;
      }).join("");
    }
    return ratingBuckets.map((count, i) => {
      if (count === 0)
        return "";
      const percentage = count / maxBucket * 100;
      return `
      <div class="hon-bar-container" title="Rating ${i}: ${count} performers">
        <div class="hon-bar-label">${i}</div>
        <div class="hon-bar-wrapper">
          <div class="hon-bar" style="width: ${percentage}%">
            ${count > 5 ? `<span class="hon-bar-count">${count}</span>` : ""}
          </div>
        </div>
      </div>`;
    }).join("");
  }
  function initStatsTabs(dialog) {
    const buttons = dialog.querySelectorAll(".hon-stats-tab");
    const panels = dialog.querySelectorAll(".hon-stats-tab-panel");
    buttons.forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const target = btn.dataset.tab;
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));
      };
    });
  }
  function initStatsCollapsibles(dialog) {
    const headers = dialog.querySelectorAll(".hon-rank-group-header, .hon-bar-group-header");
    headers.forEach((header) => {
      header.onclick = (e) => {
        e.stopPropagation();
        const groupType = header.classList.contains("hon-rank-group-header") ? ".hon-rank-group-content" : ".hon-bar-group-content";
        const content = dialog.querySelector(`${groupType}[data-group="${header.dataset.group}"]`);
        const isCollapsed = content.classList.toggle("collapsed");
        header.setAttribute("aria-expanded", !isCollapsed);
        header.querySelector(".hon-group-toggle").textContent = isCollapsed ? "\u25B6" : "\u25BC";
      };
    });
  }
  var init_ui_stats = __esm({
    "ui-stats.js"() {
      init_api_client();
      init_math_utils();
      init_formatters();
    }
  });

  // ui-modal.js
  var ui_modal_exports = {};
  __export(ui_modal_exports, {
    addFloatingButton: () => addFloatingButton,
    cleanupButtonObserver: () => cleanupButtonObserver,
    closeRankingModal: () => closeRankingModal,
    getPerformerIdFromUrl: () => getPerformerIdFromUrl,
    isOnSinglePerformerPage: () => isOnSinglePerformerPage,
    openRankingModal: () => openRankingModal,
    shouldShowButton: () => shouldShowButton
  });
  function getPerformerIdFromUrl() {
    const match = window.location.pathname.match(/^\/performers\/(\d+)(?:\/|$)/);
    return match ? match[1] : null;
  }
  function isOnSinglePerformerPage() {
    return getPerformerIdFromUrl() !== null;
  }
  function shouldShowButton() {
    const path = window.location.pathname;
    if (path === "/performers" || path === "/performers/")
      return true;
    if (path === "/images" || path === "/images/")
      return true;
    return /^\/performers\/\d+(?:\/|$)/.test(path);
  }
  function addFloatingButton() {
    const buttonId = "plugin_hon";
    const existing = document.getElementById(buttonId);
    if (!shouldShowButton()) {
      if (existing)
        existing.closest(".col-4")?.remove();
      return;
    }
    if (existing)
      return;
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "col-4 col-sm-3 col-md-2 col-lg-auto nav-link";
    buttonContainer.innerHTML = `
    <a href="javascript:void(0);" id="${buttonId}" class="minimal p-4 p-xl-2 d-flex d-xl-inline-block flex-column justify-content-between align-items-center btn btn-primary" title="HotOrNot">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 16 16" 
        class="plugin_hon__flame svg-inline--fa fa-icon nav-menu-icon d-block d-xl-inline mb-2 mb-xl-0" 
        fill="currentColor"
        aria-hidden="true" 
        focusable="false" 
        role="img">
        <path d="M15.81 9l-2.47-4.93 0.83-0.15c0.239-0.044 0.418-0.251 0.418-0.5 0-0.281-0.227-0.508-0.508-0.508-0.032 0-0.063 0.003-0.093 0.009l-0.777 0.14c-0.993-0.755-2.25-1.21-3.613-1.21-0.21 0-0.418 0.011-0.623 0.032-0.036-0.5-0.457-0.882-0.967-0.882-0.003 0-0.005 0-0.008 0-0.552 0-1 0.448-1 1v0.2c-1.714 0.336-3.151 1.327-4.066 2.697l-0.754 0.153c-0.257 0.024-0.457 0.239-0.457 0.5 0 0.277 0.225 0.502 0.502 0.502 0.016 0 0.032-0.001 0.047-0.002l0.088 0 0.35-0.050-2.52 5h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19l-2.56-5.12h0.1c0.172-0.031 0.311-0.144 0.379-0.297 0.021-0.093 0.701-1.583 3.271-2.363v10.78h-1v1h-2v1h8v-1h-2v-1h-1v-11.12c0.201-0.031 0.434-0.049 0.67-0.049 1.152 0 2.205 0.419 3.016 1.114l-0.006-0.005-2.49 5.060h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19zM5 11h-4l2-3.94zM11 9l2-3.94 2 3.94h-4z"/>
      </svg>
      <span>HotOrNot</span>
    </a>
  `;
    const button = buttonContainer.querySelector(`#${buttonId}`);
    button.addEventListener("click", openRankingModal);
    const navTarget = document.querySelector(".navbar-nav");
    if (navTarget)
      navTarget.appendChild(buttonContainer);
  }
  function watchForNavigation() {
    if (buttonObserver) {
      buttonObserver.disconnect();
    }
    buttonObserver = new MutationObserver(() => {
      addFloatingButton();
    });
    buttonObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function cleanupButtonObserver() {
    if (buttonObserver) {
      buttonObserver.disconnect();
      buttonObserver = null;
    }
  }
  function closeRankingModal() {
    const gameModal = document.getElementById("hon-modal");
    const statsModal = document.getElementById("hon-stats-modal");
    if (gameModal)
      gameModal.remove();
    if (statsModal)
      statsModal.remove();
    document.removeEventListener("keydown", handleGlobalKeys, { capture: true });
    cleanupButtonObserver();
    clearDOMCache();
  }
  function handleGlobalKeys(e) {
    const activeModal = document.getElementById("hon-modal");
    if (!activeModal) {
      document.removeEventListener("keydown", handleGlobalKeys, { capture: true });
      return;
    }
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      closeRankingModal();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      Promise.resolve().then(() => (init_match_handler(), match_handler_exports)).then((m) => m.handleUndo());
      return;
    }
    const isSpace = e.key === " " || e.code === "Space";
    const hotKeys = ["ArrowLeft", "ArrowRight", ...isSpace ? [" ", "Space"] : []];
    if (hotKeys.includes(e.key) || e.code && hotKeys.includes(e.code)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === "ArrowLeft") {
        const leftCard = activeModal.querySelector('.hon-scene-card[data-side="left"] .hon-scene-body');
        if (leftCard) {
          leftCard.click();
        }
      } else if (e.key === "ArrowRight") {
        const rightCard = activeModal.querySelector('.hon-scene-card[data-side="right"] .hon-scene-body');
        if (rightCard) {
          rightCard.click();
        }
      } else if (isSpace) {
        const skipBtn = document.getElementById("hon-skip-btn");
        if (skipBtn) {
          skipBtn.click();
        }
      }
    }
  }
  function _buildAndOpenModal() {
    try {
      const existing = document.getElementById("hon-modal");
      if (existing)
        existing.remove();
      const modal = document.createElement("div");
      modal.id = "hon-modal";
      modal.innerHTML = `
      <div class="hon-modal-backdrop"></div>
      <div class="hon-modal-content">
        <span class="hon-modal-close">\u2715</span>
        ${createMainUI()}
      </div>
    `;
      document.body.appendChild(modal);
      const closeModalBtn = modal.querySelector(".hon-modal-close");
      if (closeModalBtn) {
        closeModalBtn.onclick = () => closeRankingModal();
      }
      const modalBackdrop = modal.querySelector(".hon-modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.onclick = () => closeRankingModal();
      }
      attachEventListeners(modal);
      if (state.currentMode === "gauntlet") {
        if (state.gauntletChampion) {
          const selEl = document.getElementById("hon-performer-selection");
          const compEl = document.getElementById("hon-comparison-area");
          const actEl = document.querySelector(".hon-actions");
          if (selEl)
            selEl.style.display = "none";
          if (compEl)
            compEl.style.display = "";
          if (actEl)
            actEl.style.display = "";
          loadNewPair();
        } else {
          window.showPerformerSelection();
        }
      } else {
        loadNewPair();
      }
      document.addEventListener("keydown", handleGlobalKeys, { capture: true });
    } catch (err) {
      console.error("CRASH in _buildAndOpenModal:", err);
    }
  }
  async function openRankingModal() {
    try {
      const navbarToggle = document.querySelector(".navbar-toggler");
      if (navbarToggle && !navbarToggle.classList.contains("collapsed")) {
        navbarToggle.click();
      }
      const path = window.location.pathname;
      const performerMatch = path.match(/\/performers\/(\d+)/);
      const isSinglePerformerPage = !!performerMatch;
      if (isSinglePerformerPage) {
        const performerId = performerMatch[1];
        if (state.currentMode === "gauntlet" && state.gauntletChampion && state.gauntletChampion.id.toString() === performerId) {
          console.log("[HotOrNot] Resuming existing Gauntlet run.");
          _buildAndOpenModal();
          return;
        }
        state.battleType = "performers";
        state.currentMode = "gauntlet";
        const { fetchPerformerById: fetchPerformerById2 } = await Promise.resolve().then(() => (init_api_client(), api_client_exports));
        try {
          const performer = await fetchPerformerById2(performerId);
          if (performer) {
            state.gauntletChampion = performer;
            state.gauntletWins = 0;
            state.gauntletDefeated = [];
            state.gauntletFalling = false;
            state.gauntletFallingItem = null;
          }
        } catch (e) {
          console.warn("[HotOrNot] Could not pre-seed performer:", e);
        }
      } else {
        state.battleType = path.includes("/images") ? "images" : "performers";
        state.currentMode = "swiss";
        state.gauntletChampion = null;
      }
      _buildAndOpenModal();
    } catch (err) {
      console.error("CRASH in openRankingModal:", err);
    }
  }
  var buttonObserver;
  var init_ui_modal = __esm({
    "ui-modal.js"() {
      init_state();
      init_battle_engine();
      init_ui_dashboard();
      init_dom_utils();
      buttonObserver = null;
      window._honCleanupButtonObserver = cleanupButtonObserver;
      watchForNavigation();
      ["popstate"].forEach(
        (event) => window.addEventListener(event, () => {
          watchForNavigation();
          addFloatingButton();
        })
      );
    }
  });

  // ui-dashboard.js
  function createMainUI() {
    const isPerformers = state.battleType === "performers";
    const MODE_CONFIG = {
      swiss: { icon: "\u2696\uFE0F", label: "Swiss" },
      gauntlet: { icon: "\u{1F94A}", label: "Gauntlet" },
      champion: { icon: "\u{1F451}", label: "Champion" }
    };
    const modeToggleHTML = state.battleType !== "images" ? `
    <div class="hon-mode-toggle">
      ${["swiss", "gauntlet", "champion"].map((mode) => `
        <button class="hon-mode-btn ${state.currentMode === mode ? "active" : ""}" data-mode="${mode}">
          <span class="hon-mode-icon">${MODE_CONFIG[mode].icon}</span>
          <span class="hon-mode-title">${MODE_CONFIG[mode].label}</span>
        </button>`).join("")}
    </div>` : "";
    const genderFilterHTML = isPerformers ? `
    <div class="hon-gender-filter">
      <div class="hon-gender-btns">
        ${ALL_GENDERS.map((g) => `
          <button
            class="hon-gender-btn ${state.selectedGenders.includes(g.value) ? "active" : ""}"
            data-gender="${g.value}"
          >
            ${g.label}
          </button>`).join("")}
      </div>
    </div>` : "";
    return `
    <div id="hotornot-container" class="hon-container">
      <div class="hon-header">
        <h1 class="hon-title">\u{1F525} HotOrNot</h1>
        ${modeToggleHTML}
        ${genderFilterHTML}
        ${isPerformers ? `<button id="hon-stats-btn" class="btn btn-primary">\u{1F4CA} View All Stats</button>` : ""}
      </div>
      <div id="hon-performer-selection" style="display: none;">
        <div id="hon-performer-list">Loading...</div>
      </div>
      <div class="hon-content">
        <div id="hon-comparison-area">
          <div class="hon-loading">Loading...</div>
        </div>
        <div class="hon-actions">
          <button id="hon-skip-btn" class="btn btn-secondary">Skip (Space)</button>
          <button id="hon-undo-btn" class="btn btn-secondary" title="Undo last match (Ctrl+Z)">\u21A9 Undo</button>
        </div>
        <div class="hon-keyboard-hints">
          <span class="hon-hint"><strong>\u2B05\uFE0F</strong> Choose Left</span>
          <span class="hon-hint"><strong>\u27A1\uFE0F</strong> Choose Right</span>
          <span class="hon-hint"><strong>Space</strong> to Skip</span>
          <span class="hon-hint"><strong>Ctrl+Z</strong> to Undo</span>
		  <span class="hon-hint"><strong>ESC</strong> to Exit</span>
        </div>
      </div>
    </div>`;
  }
  function attachEventListeners(parent = document) {
    const statsBtn = parent.querySelector("#hon-stats-btn");
    if (statsBtn) {
      statsBtn.addEventListener("click", () => {
        Promise.resolve().then(() => (init_ui_stats(), ui_stats_exports)).then((m) => m.openStatsModal());
      });
    }
    const performerLinks = parent.querySelectorAll(".hon-performer-link, .hon-gauntlet-select-img");
    performerLinks.forEach((link) => {
      link.addEventListener("click", (e) => e.stopPropagation());
    });
    const skipBtn = parent.querySelector("#hon-skip-btn");
    if (skipBtn) {
      const isSkippableMode = state.currentMode === "swiss" || state.currentMode === "gauntlet";
      skipBtn.style.display = isSkippableMode ? "block" : "none";
      skipBtn.onclick = () => {
        if (state.currentMode === "swiss" || state.currentMode === "gauntlet") {
          handleSkip();
        }
      };
    }
    const undoBtn = parent.querySelector("#hon-undo-btn");
    if (undoBtn) {
      undoBtn.onclick = () => handleUndo();
      undoBtn.style.display = state.matchHistory && state.matchHistory.length > 0 ? "inline-block" : "none";
    }
    const genderButtons = parent.querySelectorAll(".hon-gender-btn");
    genderButtons.forEach((btn) => {
      btn.addEventListener("click", () => handleGenderToggle(btn.dataset.gender));
    });
    const modeButtons = parent.querySelectorAll(".hon-mode-btn");
    modeButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const newMode = btn.dataset.mode;
        if (state.currentMode === newMode)
          return;
        state.currentMode = newMode;
        modeButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.mode === newMode);
        });
        const { getPerformerIdFromUrl: getPerformerIdFromUrl2 } = await Promise.resolve().then(() => (init_ui_modal(), ui_modal_exports));
        const urlPerformerId = getPerformerIdFromUrl2();
        if (!urlPerformerId || state.gauntletChampion && state.gauntletChampion.id.toString() !== urlPerformerId) {
          state.gauntletChampion = null;
          state.gauntletWins = 0;
          state.gauntletDefeated = [];
          state.gauntletFalling = false;
        }
        const modal = document.getElementById("hon-modal");
        if (modal) {
          modal.classList.remove("hon-mode-champion", "hon-mode-swiss", "hon-mode-gauntlet");
          modal.classList.add(`hon-mode-${newMode}`);
        }
        const selectionContainer = document.getElementById("hon-performer-selection");
        const comparisonArea = document.getElementById("hon-comparison-area");
        const actionsEl = document.querySelector(".hon-actions");
        if (newMode === "swiss") {
          if (selectionContainer)
            selectionContainer.style.display = "none";
          if (comparisonArea)
            comparisonArea.style.display = "";
          if (actionsEl)
            actionsEl.style.display = "";
          loadNewPair();
        } else if (newMode === "gauntlet") {
          if (urlPerformerId && !state.gauntletChampion) {
            const { fetchPerformerById: fetchPerformerById2 } = await Promise.resolve().then(() => (init_api_client(), api_client_exports));
            state.gauntletChampion = await fetchPerformerById2(urlPerformerId);
          }
          if (state.gauntletChampion) {
            if (selectionContainer)
              selectionContainer.style.display = "none";
            if (comparisonArea)
              comparisonArea.style.display = "";
            if (actionsEl)
              actionsEl.style.display = "";
            loadNewPair();
          } else {
            if (selectionContainer)
              selectionContainer.style.display = "block";
            if (comparisonArea)
              comparisonArea.style.display = "none";
            if (actionsEl)
              actionsEl.style.display = "none";
            Promise.resolve().then(() => (init_gauntlet_selection(), gauntlet_selection_exports)).then((m) => m.loadPerformerSelection());
          }
        } else if (newMode === "champion") {
          if (urlPerformerId && !state.gauntletChampion) {
            const { fetchPerformerById: fetchPerformerById2 } = await Promise.resolve().then(() => (init_api_client(), api_client_exports));
            state.gauntletChampion = await fetchPerformerById2(urlPerformerId);
          }
          if (state.gauntletChampion) {
            if (selectionContainer)
              selectionContainer.style.display = "none";
            if (comparisonArea)
              comparisonArea.style.display = "";
            if (actionsEl)
              actionsEl.style.display = "";
            loadNewPair();
          } else {
            if (selectionContainer)
              selectionContainer.style.display = "block";
            if (comparisonArea)
              comparisonArea.style.display = "none";
            if (actionsEl)
              actionsEl.style.display = "none";
            Promise.resolve().then(() => (init_gauntlet_selection(), gauntlet_selection_exports)).then((m) => m.loadPerformerSelection());
          }
        }
      });
    });
  }
  function handleGenderToggle(gender) {
    if (state.selectedGenders.includes(gender)) {
      state.selectedGenders = state.selectedGenders.filter((g) => g !== gender);
    } else {
      state.selectedGenders.push(gender);
    }
    try {
      localStorage.setItem("hotornot_selected_genders", JSON.stringify(state.selectedGenders));
    } catch (e) {
      console.warn("[HotOrNot] Could not save gender selection to localStorage:", e);
    }
    console.log(`[HotOrNot] Gender Filter Updated: ${state.selectedGenders.join(", ")}`);
    const genderBtns = document.querySelectorAll(`.hon-gender-btn[data-gender="${gender}"]`);
    genderBtns.forEach((btn) => {
      btn.classList.toggle("active", state.selectedGenders.includes(gender));
    });
    loadNewPair();
  }
  function setMode(mode) {
    const selEl = document.getElementById("hon-performer-selection");
    const compEl = document.getElementById("hon-comparison-area");
    if (selEl)
      selEl.style.display = "none";
    if (compEl)
      compEl.style.display = "none";
    if (mode === "gauntlet") {
      Promise.resolve().then(() => (init_gauntlet_selection(), gauntlet_selection_exports)).then((m) => m.showPerformerSelection());
    }
  }
  var init_ui_dashboard = __esm({
    "ui-dashboard.js"() {
      init_state();
      init_dom_utils();
      init_constants();
      init_battle_engine();
      init_match_handler();
    }
  });

  // ui-badge.js
  function isOnSinglePerformerPage2() {
    return window.location.pathname.includes("/performers/") && !window.location.pathname.endsWith("/performers");
  }
  function createBattleRankBadge(rank, total, rating, stats = null) {
    const badge = document.createElement("div");
    badge.className = "hon-battle-rank-badge";
    badge.id = "hon-battle-rank-badge";
    const percentile = (total - rank + 1) / total * 100;
    let tierEmoji = "\u{1F525}";
    if (percentile >= 95)
      tierEmoji = "\u{1F451}";
    else if (percentile >= 80)
      tierEmoji = "\u{1F947}";
    else if (percentile >= 60)
      tierEmoji = "\u{1F948}";
    else if (percentile >= 40)
      tierEmoji = "\u{1F949}";
    let matchStatsHTML = "";
    let winRate = "0.0";
    const hasMatchStats = stats && stats.total_matches > 0;
    if (hasMatchStats) {
      winRate = (stats.wins / (stats.total_matches || 1) * 100).toFixed(1);
      let streakDisplay = "";
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
    let tooltipText = `Battle Rank #${rank} of ${total} performers (Rating: ${rating}/100)`;
    if (hasMatchStats) {
      tooltipText += `

Match Stats:`;
      tooltipText += `
\u2022 Record: ${stats.wins}W - ${stats.losses}L - ${stats.draws}D`;
      tooltipText += `
\u2022 Win Rate: ${winRate}%`;
      tooltipText += `
\u2022 Total Matches: ${stats.total_matches}`;
      if (stats.current_streak !== 0) {
        const streakType = stats.current_streak > 0 ? "Winning" : "Losing";
        tooltipText += `
\u2022 Current Streak: ${streakType} ${Math.abs(stats.current_streak)}`;
      }
      if (stats.best_streak > 0)
        tooltipText += `
\u2022 Best Streak: ${stats.best_streak}`;
      if (stats.worst_streak < 0)
        tooltipText += `
\u2022 Worst Streak: ${Math.abs(stats.worst_streak)}`;
    }
    badge.title = tooltipText;
    return badge;
  }
  async function injectBattleRankBadge() {
    const pathParts = window.location.pathname.split("/");
    const pIndex = pathParts.indexOf("performers");
    if (pIndex === -1 || !pathParts[pIndex + 1])
      return;
    const performerId = pathParts[pIndex + 1];
    setTimeout(async () => {
      if (window._honBadgeInjectionInProgress)
        return;
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
  function showPlacementScreen2(item, rank, finalRating, battleType, totalItemsCount) {
    const area = document.getElementById("hon-comparison-area");
    if (!area)
      return;
    let title, imagePath;
    if (battleType === "performers") {
      title = item.name || `Performer #${item.id}`;
      imagePath = item.image_path;
    } else if (battleType === "images") {
      title = `Image #${item.id}`;
      imagePath = item.paths?.thumbnail || null;
    } else {
      const file = item.files?.[0] || {};
      title = item.title || file.path?.split(/[/\\]/).pop().replace(/\.[^/.]+$/, "") || `Scene #${item.id}`;
      imagePath = item.paths?.screenshot || null;
    }
    area.innerHTML = `
    <div class="hon-victory-screen">
      <div class="hon-victory-crown">\u{1F4CD}</div>
      <h2 class="hon-victory-title">PLACED!</h2>
      <div class="hon-victory-scene">
        ${imagePath ? `<img class="hon-victory-image" src="${imagePath}" alt="${title}" />` : `<div class="hon-victory-image hon-no-image">No Image</div>`}
      </div>
      <h3 class="hon-victory-name">${title}</h3>
      <p class="hon-victory-stats">
        Rank <strong>#${rank}</strong> of ${totalItemsCount}<br>
        Rating: <strong>${finalRating}/100</strong>
      </p>
      <button id="hon-new-gauntlet" class="btn btn-primary">Start New Run</button>
    </div>
  `;
    document.getElementById("hon-gauntlet-status")?.remove();
    const actionsEl = document.querySelector(".hon-actions");
    if (actionsEl)
      actionsEl.style.display = "none";
    state.gauntletFalling = false;
    state.gauntletFallingItem = null;
    state.gauntletChampion = null;
    state.gauntletWins = 0;
    state.gauntletDefeated = [];
    area.querySelector("#hon-new-gauntlet")?.addEventListener("click", () => {
      if (actionsEl)
        actionsEl.style.display = "";
      loadNewPair();
    });
  }
  function showRatingAnimation(card, oldRating, newRating, change, isWinner) {
    const overlay = document.createElement("div");
    overlay.className = `hon-rating-overlay ${isWinner ? "hon-rating-winner" : "hon-rating-loser"}`;
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
  var init_ui_badge = __esm({
    "ui-badge.js"() {
      init_state();
      init_api_client();
      init_battle_engine();
    }
  });

  // ui-manager.js
  var ui_manager_exports = {};
  __export(ui_manager_exports, {
    addFloatingButton: () => addFloatingButton,
    attachEventListeners: () => attachEventListeners,
    closeRankingModal: () => closeRankingModal,
    createBattleRankBadge: () => createBattleRankBadge,
    createImageCard: () => createImageCard,
    createMainUI: () => createMainUI,
    createPerformerCard: () => createPerformerCard,
    createSceneCard: () => createSceneCard,
    createStatsModalContent: () => createStatsModalContent,
    createVictoryScreen: () => createVictoryScreen,
    generateBarGroups: () => generateBarGroups,
    generateStatTables: () => generateStatTables,
    handleGenderToggle: () => handleGenderToggle,
    injectBattleRankBadge: () => injectBattleRankBadge,
    isOnSinglePerformerPage: () => isOnSinglePerformerPage2,
    openRankingModal: () => openRankingModal,
    openStatsModal: () => openStatsModal,
    renderCard: () => renderCard,
    setMode: () => setMode,
    shouldShowButton: () => shouldShowButton,
    showPlacementScreen: () => showPlacementScreen2,
    showRatingAnimation: () => showRatingAnimation
  });
  var init_ui_manager = __esm({
    "ui-manager.js"() {
      init_ui_cards();
      init_ui_dashboard();
      init_ui_modal();
      init_ui_stats();
      init_ui_badge();
    }
  });

  // main.js
  init_state();
  init_ui_manager();
  init_ui_modal();
  init_gauntlet_selection();
  init_match_handler();
  init_api_client();
  init_parsers();
  window.openRankingModal = openRankingModal;
  window.openStatsModal = openStatsModal;
  window.closeRankingModal = closeRankingModal;
  window.handleGenderToggle = handleGenderToggle;
  window.showPerformerSelection = showPerformerSelection;
  window.handleChooseItem = handleChooseItem;
  window.handleGenderToggle = handleGenderToggle;
  var lastPath = "";
  function syncGendersFromPerformersPage() {
  }
  (function initializeSelectedGendersFromLocalStorage() {
    try {
      const saved = localStorage.getItem("hotornot_selected_genders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          state.selectedGenders = parsed;
        }
      }
    } catch (e) {
      console.warn("[HotOrNot] Failed to load selected genders from localStorage:", e);
    }
  })();
  var observer = null;
  function main() {
    if (window.honLoaded)
      return;
    window.honLoaded = true;
    console.log("[HotOrNot] Global Scope Initialized");
    if (!observer) {
      observer = new MutationObserver(() => {
        const currentPath = window.location.pathname;
        const existingBtn = document.getElementById("hon-floating-btn");
        if (existingBtn) {
          if (!shouldShowButton()) {
            existingBtn.remove();
          }
        } else if (shouldShowButton()) {
          addFloatingButton();
        }
        if (isOnSinglePerformerPage2()) {
          const badgeExists = !!document.getElementById("hon-battle-rank-badge");
          if (currentPath !== lastPath || !badgeExists) {
            lastPath = currentPath;
            setTimeout(() => {
              if (!document.getElementById("hon-battle-rank-badge")) {
                injectBattleRankBadge();
              }
            }, 300);
          }
        }
        const container = document.getElementById("stash-main-container");
        if (container && !document.getElementById("hotornot-container")) {
          container.innerHTML = createMainUI();
          attachEventListeners(container);
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    if (isOnSinglePerformerPage2()) {
      setTimeout(() => injectBattleRankBadge(), 1e3);
    }
    syncGendersFromPerformersPage();
    if (typeof PluginApi !== "undefined" && PluginApi.Event?.addEventListener) {
      PluginApi.Event.addEventListener("stash:location", (e) => {
        const path = e.detail?.data?.location?.pathname || "";
        if (path.includes("/performers")) {
          state.cachedUrlFilter = getUrlPerformerFilter();
        }
        const isListPage = path === "/performers" || path === "/performers/";
        if (isListPage) {
          setTimeout(syncGendersFromPerformersPage, 100);
        }
      });
    }
  }
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    try {
      if (typeof window._honCleanupButtonObserver === "function") {
        window._honCleanupButtonObserver();
      }
    } catch (e) {
      console.debug("[HotOrNot] Button observer cleanup not available");
    }
  }
  main();
})();
