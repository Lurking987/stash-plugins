## **1. Core / Foundational Modules**

1. **`state.js`** – global state store (all modules depend on this).
    
2. **`constants.js`** – enums, genders, or other constant values.
    
3. **`formatters.js`** – utility functions: `formatDuration`, `getCountryDisplay`, `getGenderDisplay`, `escapeHtml`.
    
4. **`math-utils.js`** – Elo parsing, rating calculations.
    

---

## **2. API Layer**

5. **`api-client.js`** – fetch performers, scenes, images, battle ranks, stats.
    
    - Depends on `state.js` optionally for caching or config.
        

---

## **3. Battle Engine**

6. **`battle-engine.js`** – selects next pair, updates ratings.
    
    - Depends on `state.js` and `api-client.js`.
        

---

## **4. UI Components (Renderers / Templates)**

7. **`ui-cards.js`** – renders cards (scenes, performers, images) and victory/placement screens.
    
    - Depends on `state.js` and `formatters.js`.
        
8. **`ui-badge.js`** – battle-rank badge, placement screen, rating animations.
    
    - Depends on `state.js`, `api-client.js`, and `ui-cards.js` (for placement screens).
        
9. **`ui-dashboard.js`** – main UI shell, mode/gender controls, skip button, attaches event listeners.
    
    - Depends on `state.js`, `ui-cards.js`, `battle-engine.js`.
        

---

## **5. Modal & Stats**

10. **`ui-modal.js`** – floating button, ranking modal open/close, keyboard navigation.
    
    - Depends on `state.js`, `ui-dashboard.js`, `battle-engine.js`.
        
11. **`ui-stats.js`** – stats modal, leaderboard, rating distribution.
    
    - Depends on `api-client.js`, `math-utils.js`, `formatters.js`.
        

---

## **6. Barrel / Unified Export**

12. **`ui-manager.js`** – re-exports all UI modules: cards, dashboard, badge, modal, stats.
    
    - Depends on all `ui-*` modules.