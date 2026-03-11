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
        selectedGenders: ["FEMALE", "NON_BINARY"]
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
  function getGenderDisplay(gender) {
    if (!gender)
      return "";
    return (ALL_GENDERS.find((g) => g.value === gender) || { label: gender }).label;
  }
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
    const stashRating = scene.rating100 ? `${scene.rating100}/100` : "Unrated";
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
    const stashRating = performer.rating100 ? `${performer.rating100}/100` : "Unrated";
    const rankDisplay = rank != null ? `<span class="hon-performer-rank hon-scene-rank">#${rank}</span>` : "";
    const streakDisplay = streak != null && streak > 0 ? `<div class="hon-streak-badge">\u{1F525} ${streak} wins</div>` : "";
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
  var init_ui_cards = __esm({
    "ui-cards.js"() {
      init_state();
      init_formatters();
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
    if (!stats.last_match)
      return 1;
    const hoursSince = (Date.now() - new Date(stats.last_match).getTime()) / (1e3 * 60 * 60);
    if (hoursSince < 1)
      return 0.1;
    if (hoursSince < 6)
      return 0.3;
    if (hoursSince < 24)
      return 0.6;
    return 1;
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
      total_matches: currentStats.total_matches + 1,
      last_match: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (won === null) {
      newStats.draws = (currentStats.draws || 0) + 1;
      return newStats;
    }
    newStats.wins = won ? currentStats.wins + 1 : currentStats.wins;
    newStats.losses = won ? currentStats.losses : currentStats.losses + 1;
    newStats.current_streak = won ? currentStats.current_streak >= 0 ? currentStats.current_streak + 1 : 1 : currentStats.current_streak <= 0 ? currentStats.current_streak - 1 : -1;
    newStats.best_streak = Math.max(currentStats.best_streak, newStats.current_streak);
    newStats.worst_streak = Math.min(currentStats.worst_streak, newStats.current_streak);
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
    return mode === "champion" ? Math.max(1, Math.round(baseK * 0.5)) : baseK;
  }
  function isActiveParticipant(performerId, mode, gauntletChampion, gauntletFallingItem) {
    if (mode === "swiss" || mode === "champion")
      return true;
    if (mode === "gauntlet") {
      return performerId === gauntletChampion?.id || performerId === gauntletFallingItem?.id;
    }
    return false;
  }
  var init_math_utils = __esm({
    "math-utils.js"() {
    }
  });

  // api-client.js
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
    if (result.errors)
      throw new Error(result.errors[0].message);
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
    const ratingDiff = loserRating - winnerRating;
    let freshWinnerObj = winnerObj;
    let freshLoserObj = loserObj;
    if (state.battleType === "performers") {
      const [fetchedWinner, fetchedLoser] = await Promise.all([
        winnerId ? fetchPerformerById(winnerId) : Promise.resolve(null),
        loserId ? fetchPerformerById(loserId) : Promise.resolve(null)
      ]);
      freshWinnerObj = fetchedWinner || winnerObj;
      freshLoserObj = fetchedLoser || loserObj;
    }
    let winnerMatchCount = 0;
    let loserMatchCount = 0;
    if (state.battleType === "performers") {
      winnerMatchCount = parsePerformerEloData(freshWinnerObj)?.total_matches || 0;
      loserMatchCount = parsePerformerEloData(freshLoserObj)?.total_matches || 0;
    }
    let winnerGain = 0;
    let loserLoss = 0;
    if (isDraw) {
      const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 400));
      const expectedLoser = 1 - expectedWinner;
      const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
      const loserK = getKFactor(loserRating, loserMatchCount, "swiss");
      winnerGain = Math.round(winnerK * (0.5 - expectedWinner));
      loserLoss = Math.round(loserK * (expectedLoser - 0.5));
    } else {
      if (state.currentMode === "gauntlet") {
        const isChampionWinner = state.gauntletChampion && winnerId === state.gauntletChampion.id;
        const isFallingWinner = state.gauntletFalling && state.gauntletFallingItem && winnerId === state.gauntletFallingItem.id;
        const isChampionLoser = state.gauntletChampion && loserId === state.gauntletChampion.id;
        const isFallingLoser = state.gauntletFalling && state.gauntletFallingItem && loserId === state.gauntletFallingItem.id;
        const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
        const kFactor = getKFactor(winnerRating, winnerMatchCount, "gauntlet");
        if (isChampionWinner || isFallingWinner) {
          winnerGain = Math.max(0, Math.round(kFactor * (1 - expectedWinner)));
        }
        if (isChampionLoser || isFallingLoser) {
          loserLoss = Math.max(0, Math.round(kFactor * expectedWinner));
        }
        if (loserRank === 1 && !isChampionLoser && !isFallingLoser) {
          loserLoss = 1;
        }
      } else if (state.currentMode === "champion") {
        const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
        const winnerK = getKFactor(winnerRating, winnerMatchCount, "champion");
        const loserK = getKFactor(loserRating, loserMatchCount, "champion");
        winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
        loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
      } else {
        const expectedWinner = 1 / (1 + Math.pow(10, ratingDiff / 40));
        const winnerK = getKFactor(winnerRating, winnerMatchCount, "swiss");
        const loserK = getKFactor(loserRating, loserMatchCount, "swiss");
        winnerGain = Math.max(0, Math.round(winnerK * (1 - expectedWinner)));
        loserLoss = Math.max(0, Math.round(loserK * expectedWinner));
      }
    }
    const newWinnerRating = Math.min(100, Math.max(1, winnerRating + winnerGain));
    const newLoserRating = Math.min(100, Math.max(1, loserRating - loserLoss));
    const winnerRankAtStart = winnerId === state.currentPair.left?.id ? state.currentRanks.left : state.currentRanks.right;
    const isFirstMatchGlobal = (state.currentMode === "gauntlet" || state.currentMode === "champion") && !state.gauntletChampion;
    const shouldTrackWinner = state.battleType === "performers" && (isActiveParticipant(winnerId, state.currentMode, state.gauntletChampion, state.gauntletFallingItem) || isFirstMatchGlobal);
    const shouldTrackLoser = state.battleType === "performers" && (isActiveParticipant(loserId, state.currentMode, state.gauntletChampion, state.gauntletFallingItem) || isFirstMatchGlobal);
    const winnerStatus = isDraw ? null : true;
    const loserStatus = isDraw ? null : false;
    await updateItemRating(winnerId, newWinnerRating, shouldTrackWinner ? freshWinnerObj : null, winnerStatus);
    await updateItemRating(loserId, newLoserRating, shouldTrackLoser ? freshLoserObj : null, loserStatus);
    return {
      newWinnerRating,
      newLoserRating,
      winnerChange: winnerGain,
      loserChange: -loserLoss
    };
  }
  async function updateItemRating(itemId, newRating, itemObj = null, won = null) {
    if (state.battleType === "performers") {
      return await updatePerformerRating(itemId, newRating, itemObj, won);
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
    const result = await graphqlQuery(`
    query FindAllPerformers($filter: FindFilterType) {
      findPerformers(filter: $filter) {
        performers { ${PERFORMER_FRAGMENT} }
      }
    }
  `, { filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const performers = result.findPerformers.performers || [];
    return performers.sort((a, b) => (b.rating100 ?? 50) - (a.rating100 ?? 50));
  }
  async function updateSceneRating(id, rating) {
    await graphqlQuery(`mutation($i: SceneUpdateInput!) { sceneUpdate(input: $i) { id } }`, {
      i: { id, rating100: Math.max(1, Math.min(100, rating)) }
    });
  }
  async function updatePerformerRating(id, rating, performerObj = null, won = null) {
    const variables = { id, rating: Math.round(rating) };
    if (performerObj && won !== void 0) {
      const stats = updatePerformerStats(parsePerformerEloData(performerObj), won);
      variables.fields = { hotornot_stats: JSON.stringify(stats) };
    }
    await graphqlQuery(`
    mutation($id: ID!, $rating: Int!, $fields: Map) {
      performerUpdate(input: { id: $id, rating100: $rating, custom_fields: { partial: $fields } }) { id }
    }`, variables);
  }
  async function updateImageRating(id, rating) {
    await graphqlQuery(`mutation($i: ImageUpdateInput!) { imageUpdate(input: $i) { id } }`, {
      i: { id, rating100: Math.max(1, Math.min(100, Math.round(rating))) }
    });
  }
  async function getPerformerBattleRank(performerId) {
    try {
      const result = await graphqlQuery(`
      query GetPerformerRank($id: ID!, $filter: FindFilterType) {
        findPerformers(filter: $filter) {
          performers {
            id
            rating100
          }
        }
        findPerformer(id: $id) {
          custom_fields
        }
      }
    `, { id: performerId, filter: { per_page: -1, sort: "rating", direction: "DESC" } });
      const allPerformers = result?.findPerformers?.performers || [];
      const targetPerformer = result.findPerformer;
      const ratedPerformers = allPerformers.filter((p) => p.rating100 !== null);
      const total = ratedPerformers.length;
      const index = ratedPerformers.findIndex((p) => p.id === performerId);
      if (index === -1)
        return null;
      let stats = null;
      const statsJson = targetPerformer?.custom_fields?.["hotornot_stats"];
      if (statsJson) {
        try {
          stats = typeof statsJson === "string" ? JSON.parse(statsJson) : statsJson;
        } catch (e) {
          console.warn("[HotOrNot] Could not parse hotornot_stats:", performerId);
        }
      }
      return { rank: index + 1, total, rating: ratedPerformers[index].rating100, stats };
    } catch (err) {
      console.error("[HotOrNot] Error calculating rank:", err);
      return null;
    }
  }
  var SCENE_FRAGMENT, PERFORMER_FRAGMENT, IMAGE_FRAGMENT;
  var init_api_client = __esm({
    "api-client.js"() {
      init_parsers();
      init_math_utils();
      init_state();
      SCENE_FRAGMENT = `id title date rating100 paths { screenshot preview } files { duration path } studio { name } performers { name } tags { name }`;
      PERFORMER_FRAGMENT = `id name image_path rating100 details custom_fields birthdate ethnicity country gender`;
      IMAGE_FRAGMENT = `id rating100 paths { thumbnail image }`;
    }
  });

  // gauntlet-selection.js
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
    state.gauntletChampion = performer;
    state.gauntletWins = 0;
    state.gauntletDefeated = [];
    state.gauntletFalling = false;
    document.getElementById("hon-performer-selection").style.display = "none";
    document.getElementById("hon-comparison-area").style.display = "";
    document.querySelector(".hon-actions").style.display = "";
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
    state.gauntletFalling = false;
    state.gauntletFallingItem = null;
    state.gauntletChampion = null;
    state.gauntletWins = 0;
    state.gauntletDefeated = [];
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
          await updateItemRating(winnerId, finalRating, winnerItem, true);
          const finalRank = Math.max(1, (loserRank || 1) - 1);
          applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, { newWinnerRating: finalRating, newLoserRating: loserRating, winnerChange: 0, loserChange: 0 });
          setTimeout(() => showPlacementScreen2(winnerItem, finalRank, finalRating, state.battleType, state.totalItemsCount), 800);
        } else {
          state.gauntletDefeated.push(winnerId);
          await updateItemRating(state.gauntletFallingItem.id, loserRating, loserItem, false);
          applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, { newWinnerRating: winnerRating, newLoserRating: loserRating, winnerChange: 0, loserChange: 0 });
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
      if (state.gauntletChampion) {
        state.gauntletFalling = true;
        state.gauntletFallingItem = loserItem;
        state.gauntletDefeated = [winnerId];
      }
      state.gauntletChampion = winnerItem;
      state.gauntletWins = 1;
      state.gauntletDefeated = [loserId];
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
      state.gauntletDefeated = [loserId];
    }
  }
  async function handleSkip() {
    const leftPerformer = state.currentPair?.left;
    const rightPerformer = state.currentPair?.right;
    if (!leftPerformer || !rightPerformer) {
      loadNewPair();
      return;
    }
    if (state.currentMode === "swiss") {
      console.log(`[HotOrNot] Tying Swiss match: ${leftPerformer.name} vs ${rightPerformer.name}`);
      try {
        await handleComparison(
          leftPerformer.id,
          rightPerformer.id,
          leftPerformer.rating100,
          rightPerformer.rating100,
          null,
          leftPerformer,
          rightPerformer,
          true
          // <--- The isDraw flag
        );
      } catch (err) {
        console.error("[HotOrNot] Tie failed:", err);
      }
    }
    loadNewPair();
  }
  function applyVisualFeedback(winnerCard, loserCard, winnerRating, loserRating, outcome) {
    winnerCard.classList.add("hon-winner");
    if (loserCard)
      loserCard.classList.add("hon-loser");
    showRatingAnimation(winnerCard, winnerRating, outcome.newWinnerRating, outcome.winnerChange, true);
    if (loserCard) {
      showRatingAnimation(loserCard, loserRating, outcome.newLoserRating, outcome.loserChange, false);
    }
    setTimeout(() => loadNewPair(), 1500);
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
  async function fetchPair() {
    const { battleType, currentMode, selectedGenders } = state;
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
  }
  function attachVictoryHandlers(area) {
    const btn = area.querySelector("#hon-new-gauntlet");
    if (btn) {
      btn.onclick = () => {
        state.gauntletChampion = null;
        state.gauntletWins = 0;
        loadNewPair();
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
  async function fetchChampionPairScenes() {
    return fetchGauntletPairScenes();
  }
  async function fetchSwissPairPerformers() {
    const genders = state.selectedGenders;
    const performerFilter = getPerformerFilter(state.cachedUrlFilter, state.selectedGenders);
    const result = await graphqlQuery(`query FindPerformersByRating($performer_filter: PerformerFilterType, $filter: FindFilterType) {
    findPerformers(performer_filter: $performer_filter, filter: $filter) { performers { ${PERFORMER_FRAGMENT} } }
  }`, { performer_filter: performerFilter, filter: { per_page: -1, sort: "rating", direction: "DESC" } });
    const performers = result.findPerformers.performers || [];
    if (performers.length < 2)
      return { items: await fetchRandomPerformers(2), ranks: [null, null] };
    const weightedList = performers.map((p, idx) => ({ p, weight: getRecencyWeight(p), idx }));
    const s1 = weightedRandomSelect(weightedList, weightedList.map((item) => item.weight));
    const rating1 = s1.p.rating100 || 50;
    const similar = weightedList.filter((item) => item.p.id !== s1.p.id && Math.abs((item.p.rating100 || 50) - rating1) <= 15);
    const s2 = similar.length > 0 ? weightedRandomSelect(similar, similar.map((i) => i.weight)) : weightedList.find((i) => i.p.id !== s1.p.id);
    return { items: [s1.p, s2.p], ranks: [s1.idx + 1, s2.idx + 1] };
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
    return fetchGauntletPairPerformers();
  }
  function handleMatchmakingLogic(list, type) {
    if (state.gauntletFalling && state.gauntletFallingItem) {
      const fallIdx = list.findIndex((i) => i.id === state.gauntletFallingItem.id);
      const below = list.filter((i, idx) => idx > fallIdx && !state.gauntletDefeated.includes(i.id));
      if (below.length === 0) {
        return { items: [state.gauntletFallingItem], ranks: [list.length], isVictory: false, isPlacement: true, placementRank: list.length, placementRating: 1 };
      }
      const nextBelow = below[0];
      return { items: [state.gauntletFallingItem, nextBelow], ranks: [fallIdx + 1, list.indexOf(nextBelow) + 1], isFalling: true };
    }
    if (!state.gauntletChampion) {
      const challenger = list[Math.floor(Math.random() * list.length)];
      const lowest = [...list].sort((a, b) => (a.rating100 || 0) - (b.rating100 || 0))[0];
      return { items: [challenger, lowest], ranks: [list.indexOf(challenger) + 1, list.indexOf(lowest) + 1], isVictory: false };
    }
    const champIdx = list.findIndex((i) => i.id === state.gauntletChampion.id);
    const opponents = list.filter((i, idx) => i.id !== state.gauntletChampion.id && !state.gauntletDefeated.includes(i.id) && (idx < champIdx || (i.rating100 || 0) >= (state.gauntletChampion.rating100 || 0)));
    if (opponents.length === 0)
      return { items: [state.gauntletChampion], ranks: [1], isVictory: true };
    const nextOpponent = opponents[opponents.length - 1];
    return { items: [state.gauntletChampion, nextOpponent], ranks: [champIdx + 1, list.indexOf(nextOpponent) + 1], isVictory: false };
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
    const maxBucket = Math.max(...ratingBuckets, 1);
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
    closeRankingModal: () => closeRankingModal,
    openRankingModal: () => openRankingModal,
    shouldShowButton: () => shouldShowButton
  });
  function shouldShowButton() {
    return ["/performers", "/performers/", "/images", "/images/"].includes(window.location.pathname);
  }
  function addFloatingButton() {
    if (document.getElementById("hon-floating-btn"))
      return;
    if (!shouldShowButton())
      return;
    const btn = document.createElement("button");
    btn.id = "hon-floating-btn";
    btn.innerHTML = "\u{1F525}";
    btn.onclick = () => window.openRankingModal();
    btn.setAttribute("onclick", "window.openRankingModal()");
    document.body.appendChild(btn);
  }
  function handleGlobalKeys(e) {
    const activeModal = document.getElementById("hon-modal-container");
    if (!activeModal) {
      document.removeEventListener("keydown", handleGlobalKeys);
      return;
    }
    const hotKeys = ["ArrowLeft", "ArrowRight", " ", "Space"];
    if (hotKeys.includes(e.key) || hotKeys.includes(e.code)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      if (e.key === "ArrowLeft") {
        activeModal.querySelector('.hon-scene-card[data-side="left"] .hon-scene-body')?.click();
      }
      if (e.key === "ArrowRight") {
        activeModal.querySelector('.hon-scene-card[data-side="right"] .hon-scene-body')?.click();
      }
      if (e.key === " " || e.code === "Space") {
        document.getElementById("hon-skip-btn")?.click();
      }
    }
  }
  function openRankingModal() {
    try {
      const path = window.location.pathname;
      state.battleType = path.includes("/images") ? "images" : "performers";
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
      modal.querySelector(".hon-modal-close").onclick = () => closeRankingModal();
      modal.querySelector(".hon-modal-backdrop").onclick = () => closeRankingModal();
      attachEventListeners(modal);
      if (state.currentMode === "gauntlet") {
        window.showPerformerSelection();
      } else {
        loadNewPair();
      }
      document.addEventListener("keydown", handleGlobalKeys);
    } catch (err) {
      console.error("CRASH in openRankingModal:", err);
    }
  }
  function closeRankingModal() {
    const gameModal = document.getElementById("hon-modal");
    const statsModal = document.getElementById("hon-stats-modal");
    if (gameModal)
      gameModal.remove();
    if (statsModal)
      statsModal.remove();
    document.removeEventListener("keydown", handleGlobalKeys);
  }
  var init_ui_modal = __esm({
    "ui-modal.js"() {
      init_state();
      init_battle_engine();
      init_ui_dashboard();
    }
  });

  // ui-dashboard.js
  function createMainUI() {
    const isPerformers = state.battleType === "performers";
    const MODE_LABELS = {
      swiss: "\u2696\uFE0F Swiss",
      gauntlet: "\u{1F94A} Gauntlet",
      champion: "\u{1F451} Champion"
    };
    const modeToggleHTML = state.battleType !== "images" ? `
    <div class="hon-mode-toggle">
      ${["swiss", "gauntlet", "champion"].map((mode) => `
        <button class="hon-mode-btn ${state.currentMode === mode ? "active" : ""}" data-mode="${mode}">
          ${MODE_LABELS[mode]}
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
        </div>
        <div class="hon-keyboard-hints">
          <span class="hon-hint"><strong>\u2B05\uFE0F</strong> Choose Left</span>
          <span class="hon-hint"><strong>\u27A1\uFE0F</strong> Choose Right</span>
          <span class="hon-hint"><strong>Space</strong> to Skip</span>
        </div>
      </div>
    </div>`;
  }
  function attachEventListeners(parent = document) {
    parent.querySelector("#hon-stats-btn")?.addEventListener("click", () => {
      Promise.resolve().then(() => (init_ui_stats(), ui_stats_exports)).then((m) => m.openStatsModal());
    });
    parent.querySelectorAll(".hon-performer-link, .hon-gauntlet-select-img").forEach((link) => {
      link.addEventListener("click", (e) => e.stopPropagation());
    });
    const skipBtn = parent.querySelector("#hon-skip-btn");
    if (skipBtn) {
      skipBtn.style.display = state.currentMode === "swiss" ? "block" : "none";
      skipBtn.onclick = () => {
        if (state.currentMode === "swiss")
          handleSkip();
      };
    }
    parent.querySelectorAll(".hon-gender-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleGenderToggle(btn.dataset.gender));
    });
    parent.querySelectorAll(".hon-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newMode = btn.dataset.mode;
        if (state.currentMode === newMode)
          return;
        state.currentMode = newMode;
        state.gauntletChampion = null;
        state.gauntletFalling = false;
        state.gauntletWins = 0;
        state.gauntletDefeated = [];
        const modalContent = document.querySelector(".hon-modal-content");
        const mainContainer = document.getElementById("stash-main-container");
        if (modalContent) {
          modalContent.innerHTML = `<span class="hon-modal-close">\u2715</span>${createMainUI()}`;
          attachEventListeners(modalContent);
          modalContent.querySelector(".hon-modal-close").onclick = () => Promise.resolve().then(() => (init_ui_modal(), ui_modal_exports)).then((m) => m.closeRankingModal());
        } else if (mainContainer) {
          mainContainer.innerHTML = createMainUI();
          attachEventListeners(mainContainer);
        }
        if (newMode === "gauntlet") {
          window.showPerformerSelection();
        } else {
          loadNewPair();
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
    console.log(`[HotOrNot] Gender Filter Updated: ${state.selectedGenders.join(", ")}`);
    document.querySelectorAll(`.hon-gender-btn[data-gender="${gender}"]`).forEach((btn) => {
      btn.classList.toggle("active", state.selectedGenders.includes(gender));
    });
    loadNewPair();
  }
  var init_ui_dashboard = __esm({
    "ui-dashboard.js"() {
      init_state();
      init_constants();
      init_battle_engine();
      init_match_handler();
    }
  });

  // ui-badge.js
  function isOnSinglePerformerPage() {
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
  var lastPath = "";
  var observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (!document.getElementById("hon-floating-btn")) {
      addFloatingButton();
    }
    if (isOnSinglePerformerPage()) {
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
  function main() {
    if (window.honLoaded)
      return;
    window.honLoaded = true;
    console.log("[HotOrNot] Global Scope Initialized");
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (isOnSinglePerformerPage()) {
      setTimeout(() => injectBattleRankBadge(), 1e3);
    }
    if (typeof PluginApi !== "undefined" && PluginApi.Event?.addEventListener) {
      PluginApi.Event.addEventListener("stash:location", (e) => {
        const path = e.detail?.data?.location?.pathname || "";
        if (path.includes("/performers")) {
          state.cachedUrlFilter = getUrlPerformerFilter();
        }
      });
    }
  }
  main();
})();
