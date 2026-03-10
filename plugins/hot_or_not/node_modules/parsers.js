/**
 * URL FILTER PARSING & NORMALIZATION
 */
 import { ARRAY_BASED_MODIFIERS } from './constants.js';

export function parseUrlFilterCriteria() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const criteriaParams = urlParams.getAll('c');
    
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
        // Handle Stash's custom parenthesis encoding
        let normalized = decoded.trim().replace(/\(/g, '{').replace(/\)/g, '}');
        
        try {
          const criteria = JSON.parse(normalized);
          const result = Array.isArray(criteria) ? criteria : [criteria];
          allParsedCriteria.push(...result);
        } catch (parseErr) {
          const delimiter = '|||SPLIT|||';
          const withDelimiter = normalized.replace(/\}\s*,?\s*\{/g, '}' + delimiter + '{');
          const criteriaStrings = withDelimiter.split(delimiter);
          
          for (const criteriaStr of criteriaStrings) {
            try {
              const criterion = JSON.parse(criteriaStr.trim());
              if (criterion?.type) allParsedCriteria.push(criterion);
            } catch (splitParseErr) {
              console.warn('[HotOrNot] Could not parse criterion:', criteriaStr);
            }
          }
        }
      }
    }
    return allParsedCriteria;
  } catch (e) {
    console.warn('[HotOrNot] Error parsing URL filter criteria:', e);
    return [];
  }
}

export function extractSimpleValue(value) {
  if (value === undefined || value === null) return value;
  if (typeof value === 'object' && !Array.isArray(value) && value.value !== undefined) {
    return value.value;
  }
  return value;
}

export function safeParseInt(value, defaultValue = 0) {
  const simpleValue = extractSimpleValue(value);
  if (simpleValue === undefined || simpleValue === null) return defaultValue;
  const parsed = parseInt(simpleValue, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function normalizeGenderValue(value) {
  if (!value || typeof value !== 'string') return value;
  const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
  const validGenders = new Set(['MALE', 'FEMALE', 'TRANSGENDER_MALE', 'TRANSGENDER_FEMALE', 'INTERSEX', 'NON_BINARY']);
  
  if (validGenders.has(normalized)) return normalized;
  console.warn(`[HotOrNot] Invalid gender value "${value}"`);
  return value;
}

/**
 * Internal helper for numeric logic
 */
function createNumericFilterObject(value, modifier, defaultModifier) {
  const filterObj = {
    value: safeParseInt(value, 0),
    modifier: modifier || defaultModifier
  };
  if (typeof value === 'object' && !Array.isArray(value) && value.value2 !== undefined) {
    filterObj.value2 = safeParseInt(value.value2, 0);
  }
  return filterObj;
}

/**
 * Main conversion engine for URL -> GraphQL
 */
export function convertCriterionToFilter(criterion) {
  if (!criterion || !criterion.type) return null;

  const { type, value, modifier } = criterion;
  
  switch (type) {
    case 'tags':
    case 'studios':
      if (value?.items?.length > 0) {
        const ids = value.items.map(item => (typeof item === 'object' && item !== null && 'id' in item) ? item.id : item);
        return {
          [type]: {
            value: ids,
            modifier: modifier || 'INCLUDES',
            depth: value.depth || 0
          }
        };
      }
      break;
        
    case 'gender':
      if (value) {
        let genderValue = extractSimpleValue(value);
        if (genderValue) {
          const effectiveModifier = modifier || 'EQUALS';
          const useValueList = ARRAY_BASED_MODIFIERS.has(effectiveModifier);
          
          if (useValueList) {
            const genderArray = Array.isArray(genderValue) ? genderValue : [genderValue];
            return {
              gender: {
                value_list: genderArray.map(g => normalizeGenderValue(g)),
                modifier: effectiveModifier
              }
            };
          } else {
            if (Array.isArray(genderValue)) genderValue = genderValue[0] || null;
            if (genderValue) {
              return {
                gender: { value: normalizeGenderValue(genderValue), modifier: effectiveModifier }
              };
            }
          }
        }
      }
      break;

    case 'favorite':
    case 'filter_favorites':
      if (value !== undefined && value !== null) {
        const favValue = extractSimpleValue(value);
        return { filter_favorites: favValue === true || favValue === 'true' };
      }
      break;

    case 'rating':
    case 'rating100':
      return value != null ? { rating100: createNumericFilterObject(value, modifier, 'GREATER_THAN') } : null;

    case 'age':
      return value != null ? { age: createNumericFilterObject(value, modifier, 'EQUALS') } : null;

    case 'ethnicity':
    case 'country':
    case 'hair_color':
    case 'eye_color':
      if (value) {
        const simpleVal = extractSimpleValue(value);
        if (simpleVal) return { [type]: { value: simpleVal, modifier: modifier || 'EQUALS' } };
      }
      break;

    case 'scene_count':
    case 'image_count':
    case 'gallery_count':
      return value != null ? { [type]: createNumericFilterObject(value, modifier, 'GREATER_THAN') } : null;
    case 'o_counter':
      return value != null ? { o_counter: createNumericFilterObject(value, modifier, 'GREATER_THAN') } : null;

    case 'stash_id':
    case 'stash_id_endpoint':
      if (value && typeof value === 'object') {
        const stashIdFilter = {};
        if (value.stash_id) stashIdFilter.stash_id = value.stash_id;
        if (value.endpoint) stashIdFilter.endpoint = value.endpoint;
        if (Object.keys(stashIdFilter).length > 0) {
          stashIdFilter.modifier = modifier || 'NOT_NULL';
          return { stash_id_endpoint: stashIdFilter };
        }
      }
      break;

    case 'is_missing':
      const missingVal = extractSimpleValue(value);
      return missingVal ? { is_missing: missingVal } : null;

    case 'name':
    case 'aliases':
    case 'details':
    case 'career_length':
    case 'tattoos':
    case 'piercings':
    case 'url':
    case 'birthdate':
    case 'death_date':
    case 'created_at':
    case 'updated_at':
      const textVal = extractSimpleValue(value);
      const defaultMod = (type === 'birthdate' || type === 'death_date') ? 'EQUALS' : (type.includes('_at') ? 'GREATER_THAN' : 'INCLUDES');
      if (textVal) return { [type]: { value: textVal, modifier: modifier || defaultMod } };
      break;

    default:
      console.log(`[HotOrNot] Unknown criterion type: ${type}`);
      return null;
  }
  return null;
}

/**
 * High-level parser to get the full filter object
 */
export function getUrlPerformerFilter() {
  const criteria = parseUrlFilterCriteria();
  const filter = {};
  for (const criterion of criteria) {
    const filterPart = convertCriterionToFilter(criterion);
    if (filterPart) Object.assign(filter, filterPart);
  }
  return filter;
}

/**
 * Builds the standard performer filter based on selected genders and URL state
 */
export function getPerformerFilter(cachedUrlFilter, selectedGenders) {
  const filter = { ...cachedUrlFilter };
  delete filter.gender;

  if (selectedGenders.length > 0) {
    filter.gender = { value_list: selectedGenders, modifier: "INCLUDES" };
  }

  // Exclude missing images if no other filters are active
  const hasOtherFilters = Object.keys(cachedUrlFilter || {}).some(k => k !== "gender");
  if (!hasOtherFilters && !filter.NOT) {
    filter.NOT = { is_missing: "image" };
  }
  return filter;
}

/**
 * Build a performer filter restricted to a specific gender, used to ensure same-gender battles.
 * @param {string} gender - GraphQL GenderEnum value (e.g. "FEMALE")
 * @param {Object} cachedUrlFilter - The current URL filters to maintain
 * @returns {Object} GraphQL PerformerFilterType object
 */
export function getPerformerFilterForGender(gender, cachedUrlFilter = {}) {
  const filter = { ...cachedUrlFilter };
  delete filter.gender;

  // Exact gender match for this battle
  filter.gender = {
    value: gender,
    modifier: "EQUALS"
  };

  // Exclude performers with missing default image when no other URL filters are active
  const hasOtherUserFilters = Object.keys(cachedUrlFilter).some(k => k !== "gender");
  if (!hasOtherUserFilters && !filter.NOT) {
    filter.NOT = {
      is_missing: "image"
    };
  }

  return filter;
}

