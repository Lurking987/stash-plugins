## 1. Core “Source of Truth”

**`state.js`** – Holds global state:

- `currentPair` → current left/right items
    
- `currentRanks` → battle ranks of current pair
    
- `currentMode` → "swiss", "gauntlet", "champion"
    
- `battleType` → "performers", "images", "scenes"
    
- `gauntletChampion` → current champion (Gauntlet/Champion mode)
    
- `gauntletWins`, `gauntletDefeated` → track progress
    
- `selectedGenders` → filters for performers
    

**`resetBattleState()`** → resets gauntlet-specific progress without touching global app config.

---

## 2. UI Components

### a) Cards (`ui-cards.js`)

- **Render functions:**
    
    - `createSceneCard(scene)`
        
    - `createPerformerCard(performer)`
        
    - `createImageCard(image)`
        
    - `createVictoryScreen(champion)`
        
- Adds streak badges, rank displays, ratings, and click handlers.
    
- Integrated with `state` for streaks and gauntlet wins.
    

### b) Dashboard (`ui-dashboard.js`)

- Main UI shell for the modal and main page:
    
    - Mode toggles: Swiss / Gauntlet / Champion
        
    - Gender filters (for performers)
        
    - Skip button (Swiss only)
        
- **Event listeners:**
    
    - Gender toggle → updates `state.selectedGenders`
        
    - Mode switch → updates `state.currentMode` and resets gauntlet state
        
    - Skip button → triggers `handleSkip()`
        
- Calls `loadNewPair()` from the battle engine whenever mode/filter changes.
    

### c) Badge / Placement (`ui-badge.js`)

- **Performer page:** injects Battle Rank badge
    
    - Calls `getPerformerBattleRank(id)` from API
        
    - Displays emoji based on percentile
        
- **Placement screen:** shows final ranking after a gauntlet
    
- **Rating animation:** visual feedback for winner/loser changes
    

### d) Modal (`ui-modal.js`)

- Floating button (“🔥”) triggers **ranking modal**
    
- Keyboard navigation:
    
    - Left/Right → choose left/right card
        
    - Space → skip
        
- Modal integrates with `ui-dashboard.js` for dynamic content
    

### e) Stats (`ui-stats.js`)

- Opens stats modal:
    
    - Leaderboards (collapsible, 250-performer groups)
        
    - Rating distribution bars
        
    - Tabs: Leaderboard / Rating Distribution
        
- Fetches performers via API → parses Elo ratings → renders tables and graphs
    

### f) UI Manager (`ui-manager.js`)

- Barrel export to unify:
    
    - Cards, Dashboard, Modal, Badge, Stats
        
- Lets other modules import everything via `ui-manager.js`
    

---

## 3. Battle Engine & API

- **`battle-engine.js`** (not included here but referenced):
    
    - `loadNewPair()` → fetches next pair for voting
        
    - Updates `state.currentPair` and `state.currentRanks`
        
- **`api-client.js`**:
    
    - Fetch performers/scenes/images
        
    - Fetch performer battle rank
        
    - Fetch all performer stats
        
- **`math-utils.js`**:
    
    - Parse Elo ratings
        
    - Calculate win rates and streaks
        

---

## 4. Flow Diagram (Textual)

Page Load / Performer Page
          │  
          ▼  
      state initialized  
          │  
          ▼  
      injectBattleRankBadge()  ──► fetchPerformerBattleRank(id)  
          │  
          ▼  
      Badge displayed on page  
            
User clicks "🔥" floating button
          │  
          ▼  
   openRankingModal() ──► createMainUI()  
          │  
          ▼  
   attachEventListeners()  
          │  
          ├─ Gender toggle → update state.selectedGenders → loadNewPair()  
          ├─ Mode toggle → update state.currentMode → reset gauntlet → loadNewPair() / showPerformerSelection()  
          ├─ Skip button → handleSkip()  
          ▼  
   loadNewPair() ──► battle-engine selects next pair → state.currentPair updated  
          │  
          ▼  
   renderCard(left/right) ──► ui-cards.js  
          │  
          ▼  
   User votes → update ratings, optionally showRatingAnimation()  
          │  
          ▼  
   If Gauntlet ends → showPlacementScreen() / createVictoryScreen()  
          │  
          ▼  
   Optional: openStatsModal() → fetchAllPerformerStats() → generateStatTables() / generateBarGroups()

---

## 5. Mode-specific Behaviors

|Mode|Behavior|
|---|---|
|Swiss|Random pairs, skip allowed, gender filters active|
|Gauntlet|Champion seeded, defeated opponents tracked, final placement screen after all matches|
|Champion|Continuous battle until a new champion is crowned|

---

## 6. Keyboard Controls

- **Left Arrow** → choose left card
    
- **Right Arrow** → choose right card
    
- **Space** → skip current pair (Swiss mode only)