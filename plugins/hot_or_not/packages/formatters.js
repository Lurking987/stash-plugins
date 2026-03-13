import { COUNTRY_NAMES, ALL_GENDERS } from './constants.js';

/**
 * Converts gender enum to readable label.
 */
export function getGenderDisplay(gender) {
  if (!gender) return "";
  return (ALL_GENDERS.find(g => g.value === gender) || { label: gender }).label;
}

export function formatDuration(seconds) {
  if (!seconds) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` 
    : `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Simple HTML Escaper
 */
export function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts country code to HTML with flag icon.
 */
export function getCountryDisplay(countryCode) {
  if (!countryCode) return "";
  const code = countryCode.toUpperCase().trim();
  
  // Use escapeHtml for the name fallback
  const name = COUNTRY_NAMES[code] || escapeHtml(code);
  
  const flagClass = `fi fi-${code.toLowerCase().replace(/[^a-z]/g, "")}`;
  return `<span class="${flagClass}"></span> ${name}`;
}
