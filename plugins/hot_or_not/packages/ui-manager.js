/**
 * ui-manager.js
 *
 * Barrel re-export — keeps all existing import paths working while
 * the real logic lives in focused sub-modules:
 *
 *   ui-cards.js      — card templates (scene, performer, image, victory)
 *   ui-dashboard.js  — main UI shell, event listeners, gender/mode controls
 *   ui-modal.js      — ranking modal open/close, floating button, keyboard nav
 *   ui-stats.js      — stats modal, leaderboard table, rating distribution graph
 *   ui-badge.js      — performer-page battle-rank badge, placement screen, rating animation
 */

export { renderCard, createSceneCard, createPerformerCard, createImageCard, createVictoryScreen } from './ui-cards.js';
export { createMainUI, attachEventListeners, handleGenderToggle, setMode } from './ui-dashboard.js';
export { shouldShowButton, addFloatingButton, openRankingModal, closeRankingModal } from './ui-modal.js';
export { openStatsModal, createStatsModalContent, generateStatTables, generateBarGroups } from './ui-stats.js';
export { isOnSinglePerformerPage, createBattleRankBadge, injectBattleRankBadge, showPlacementScreen, showRatingAnimation } from './ui-badge.js';
