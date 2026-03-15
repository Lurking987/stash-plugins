# 📚 HotOrNot Plugin – Table of Contents  
  
## Core System  
- [[#`hotornot.js` – Bootstrapper]]
- [[#`main.js` – DOM Manager, Runtime Controller]]
- [[#`constants.js` – Filter Behavior, Gender Options, Country names]]
  
---  
  
## Battle Engine  
- [[#`battle-engine.js` – Matchmaking logic, UI Render]]
- [[#`match-handler.js` – Handles Battle Outcomes & Progression]]
- [[#`gauntlet-selection.js` – Gauntlet Mode Handler]]
  
---  
  
## API & Data  
- [[Hot or Not Achitecture#`api-client.js` – Graphql Query, Rating Updates & Rank Logic]]
- [[#`parsers.js` – URL Filter Parsing & GraphQL Conversion]]
  
---  
  
## Math & Utilities  
- [[#`math-utils.js` – Rating & Matchmaking Utilities]]
- [[#`formatters.js` – UI Data Format Display]]
  
---  

## UI System  
  
### Core UI  
- [[#`ui-manager.js` – UI Barrel Export]]
- [[Hot or Not Achitecture#`ui-dashboard.js` – Main Dashboard & Event Handling]]
- [[#`ui-modal.js` – Navigation & Modal Control]]
  
### UI Components  
- [[#`ui-cards.js` – Card Rendering & Victory Screen]]
- [[#`ui-badge.js` – UI Helpers for Badges, Placement, and Animations]]
  
### UI Analytics  
- [[#`ui-stats.js` – Stats Modal & Leaderboards]]
--- 


# `api-client.js` – Graphql Query, Rating Updates & Rank Logic

Purpose:  
Handles **GraphQL communication, data fetching, rating updates, and ranking logic** for the **HotOrNot Stash plugin**.

It acts as the **central API layer** between the plugin UI/logic and the **Stash GraphQL backend**.

---

## 1. Core GraphQL Layer

### `graphqlQuery(query, variables)`

Universal GraphQL requester.

**Features**

- Uses **Apollo client** when available via `PluginApi`
    
- Falls back to **fetch("/graphql")**
    
- Auto-detects **query vs mutation**
    
- Throws errors from GraphQL responses
    

**Used by:**  
All fetch + mutation functions.

---

## 2. GraphQL Fragments

Reusable field sets for queries.

### `SCENE_FRAGMENT`

Scene data used for scene battles.

Includes:

- metadata
    
- paths
    
- performers
    
- studio
    
- tags
    
- rating
    

### `PERFORMER_FRAGMENT`

Performer battle data.

Includes:

- profile info
    
- rating
    
- custom fields
    
- demographics
    

### `IMAGE_FRAGMENT`

Minimal image battle data.

Includes:

- rating
    
- thumbnail
    
- full image path
    

---

## 3. Fetching Logic

### Scene Fetching

### `fetchSceneCount()`

Returns total scene count.

### `fetchRandomScenes(count)`

Fetches random scenes for battles.

Process

1. get total count
    
2. request random scenes
    
3. shuffle locally
    
4. return requested count
    

---

### Performer Fetching

### `fetchPerformerById(id)`

Fetches full performer object.

Used for:

- fresh stats
    
- rating updates
    

---

### `fetchPerformerCount(filter)`

Returns performer count based on filter.

Used for:

- gender filtering
    
- URL filtering
    

---

### `fetchRandomPerformers(count)`

Fetches random performers for battles.

Process

1. pick random gender from `state.selectedGenders`
    
2. build filter via `getPerformerFilter`
    
3. query performers
    
4. shuffle locally
    
5. return pair
    

Safety checks:

- requires ≥2 performers
    

---

### Image Fetching

### `fetchImageCount()`

Returns total image count.

### `fetchRandomImages(count)`

Returns random image pair.

Process

1. fetch image count
    
2. query random images
    
3. shuffle locally
    
4. return 2
    

---

## 4. Comparison Engine

### `handleComparison(...)`

Core **battle resolution logic**.

Responsibilities:

- Fetch fresh performer data
    
- Calculate **ELO rating changes**
    
- Apply different rules based on battle mode
    
- Update ratings in database
    

Supports:

|Mode|Behavior|
|---|---|
|Swiss|normal Elo|
|Champion|champion vs challenger|
|Gauntlet|winner stays|

Handles:

- wins
    
- losses
    
- draws
    

Calls:

updateItemRating()

Returns:

{  
 newWinnerRating  
 newLoserRating  
 winnerChange  
 loserChange  
}

---

## 5. Rating Updates

### `updateItemRating()`

Router that updates rating based on battle type.

Routes to:

|Type|Function|
|---|---|
|scenes|`updateSceneRating()`|
|performers|`updatePerformerRating()`|
|images|`updateImageRating()`|

---

### `updateSceneRating(id, rating)`

Updates scene `rating100`.

---

### `updateImageRating(id, rating)`

Updates image `rating100`.

---

### `updatePerformerRating(id, rating, performerObj, won)`

Updates:

- performer rating
    
- battle statistics
    

Stats stored in:

custom_fields.hotornot_stats

Stats handled via:

updatePerformerStats()  
parsePerformerEloData()

---

## 6. Stats / Dashboard Data

### `fetchAllPerformerStats()`

Returns **all performers sorted by rating**.

Used for:

- leaderboard
    
- stats dashboards
    

Sort order:

rating100 DESC

---

## 7. Plugin Configuration

### `getHotOrNotConfig()`

Fetches plugin config from Stash:

configuration.plugins["HotOrNot"]

Cached locally.

---

### `isBattleRankBadgeEnabled()`

Returns boolean controlling UI rank badges.

Default:

true

---

## 8. Rank Calculation

### `getPerformerBattleRank(performerId)`

Calculates rank locally.

Process

1. fetch all performer ratings
    
2. sort descending
    
3. find performer index
    
4. return:
    

{  
 rank  
 total  
 rating  
 stats  
}

Stats parsed from:

custom_fields.hotornot_stats

---

## 9. External Dependencies

Imported modules:

|Module|Purpose|
|---|---|
|`parsers.js`|URL & gender filters|
|`math-utils.js`|Elo math & stats|
|`state.js`|global plugin state|

Key functions used:

getPerformerFilter()  
parsePerformerEloData()  
updatePerformerStats()  
getKFactor()  
isActiveParticipant()

---

## 10. Role in Plugin Architecture

`api-client.js` sits between:

UI Components  
      ↓  
Battle Logic  
      ↓  
api-client.js  
      ↓  
Stash GraphQL API

Responsibilities:

GraphQL communication  
Data retrieval  
Battle calculations  
Database mutations  
Plugin configuration  
Ranking logic


---

# `battle-engine.js` – Matchmaking logic, UI Render

Purpose:  
Controls the **battle flow, matchmaking logic, and UI rendering** for the HotOrNot plugin.

It acts as the **main gameplay controller**, coordinating:

- match selection
    
- battle modes
    
- UI rendering
    
- game progression
    

---

## 1. Core Role in Architecture

Position in plugin stack:

UI Events  
   ↓  
match-handler.js  
   ↓  
battle-engine.js  
   ↓  
api-client.js  
   ↓  
Stash GraphQL

Responsibilities:

Pair matchmaking  
Mode logic (Swiss / Gauntlet / Champion)  
Game loop  
Card rendering  
Victory handling  
State management

---

## 2. Battle Dispatcher

### `fetchPair()`

Main **mode router**.

Chooses correct matchmaking function based on:

state.currentMode  
state.battleType

Routes to:

|Mode|Scenes|Performers|Images|
|---|---|---|---|
|Swiss|`fetchSwissPairScenes`|`fetchSwissPairPerformers`|`fetchSwissPairImages`|
|Gauntlet|`fetchGauntletPairScenes`|`fetchGauntletPairPerformers`|Swiss fallback|
|Champion|`fetchChampionPairScenes`|`fetchChampionPairPerformers`|Swiss fallback|

---

## 3. Game Loop

### `loadNewPair()`

Central **match lifecycle controller**.

Steps:

Reset state  
Check gauntlet setup  
Fetch pair  
Check victory  
Check placement  
Render cards  
Attach listeners

Handles UI states:

|State|Action|
|---|---|
|Victory|`createVictoryScreen()`|
|Placement|`showPlacementScreen()`|
|Match|render VS cards|

---

## 4. UI Event Binding

### `attachBattleListeners()`

Adds interaction to battle cards.

Features:

Click → choose item  
Hover → preview video  
Mouse leave → reset video

Calls:

handleChooseItem()

---

### `attachVictoryHandlers()`

Handles **New Gauntlet button**.

Resets:

state.gauntletChampion  
state.gauntletWins  
state.gauntletDefeated  
state.gauntletFalling

Then:

showPerformerSelection()  
or  
loadNewPair()

---

## 5. Swiss Mode Matchmaking

Swiss system tries to match **similar ratings**.

### `fetchSwissPairScenes()`

Algorithm:

Fetch all scenes sorted by rating  
Pick random scene  
Find similar rating opponent  
Return pair

Match window:

<= 50 items → ±20 rating  
> 50 items → ±10 rating

---

### `fetchSwissPairImages()`

Optimized for **large libraries**.

If images > 1000:

Sample random 500

Otherwise:

Load all sorted by rating

Then same matching logic.

---

### `fetchSwissPairPerformers()`

Adds **recency weighting**.

Steps:

Fetch performers sorted by rating  
Apply recency weight  
Select weighted performer  
Find similar rating opponent

Uses:

getRecencyWeight()  
weightedRandomSelect()

---

## 6. Gauntlet Mode

Gauntlet = **one champion fights challengers**.

### `fetchGauntletPairScenes()`

Flow:

Load all scenes  
Store total count  
Call matchmaking logic

Returns:

Champion vs challenger

---

### `fetchGauntletPairPerformers()`

Same system but filtered by:

Champion gender  
or  
Selected gender

Uses:

getPerformerFilter()

---

## 7. Champion Mode

### `fetchChampionPairScenes()`

### `fetchChampionPairPerformers()`

Champion mode **reuses gauntlet matchmaking**.

Difference occurs in:

match-handler.js rating logic

---

## 8. Matchmaking Core

### `handleMatchmakingLogic(list, type)`

Central **Gauntlet/Champion pairing engine**.

Handles 3 states:

---

## Falling State

Champion lost and must fall through rankings.

state.gauntletFalling

Logic:

Find next lower ranked opponent  
Fight until placement determined

Returns:

isPlacement = true

---

## No Champion

Start new gauntlet.

Random challenger  
vs  
Lowest rated opponent

---

## Existing Champion

Champion fights next opponent.

Opponent selection:

not defeated  
not champion  
rating ≥ champion OR higher ranked

Closest opponent chosen.

Victory if no opponents remain.

---

## 9. Victory Logic

### `isChampionVictory()`

Checks if champion defeated all higher ranks.

Condition:

No remaining opponents above champion

Returns:

true / false

---

## 10. Data Structure Returned by Matchmakers

All matchmakers return:

{  
 items: [left, right],  
 ranks: [leftRank, rightRank],  
 isVictory?: boolean,  
 isPlacement?: boolean,  
 isFalling?: boolean  
}

---

## 11. External Dependencies

### API Layer

api-client.js

Used for:

graphqlQuery  
random item fetching  
rating updates

---

### Math Utilities

math-utils.js

Provides:

recency weighting  
weighted random selection

---

### State

state.js

Holds:

battleType  
currentMode  
currentPair  
gauntletChampion  
gauntletDefeated  
gauntletFalling

---

### UI

ui-manager.js  
gauntlet-selection.js

Used for:

card rendering  
victory screens  
selection screens

---

## 12. Summary

`battle-engine.js` is the plugin’s **game controller**.

Main responsibilities:

Battle matchmaking  
Mode handling  
Game loop  
UI rendering  
Victory detection  
State transitions

It coordinates the **entire HotOrNot gameplay flow**.

---

# `constants.js` – Filter Behavior, Gender Options, Country names

Purpose:  
Defines **immutable global constants** used throughout the HotOrNot plugin.

These constants standardize **gender options, country names, and filter behavior**.

---

## 1. Gender Definitions

### `ALL_GENDERS`

List of **supported performer gender types**.

Structure:

{  
  value: "FEMALE",  
  label: "Female"  
}

Example values:

FEMALE  
MALE  
TRANSGENDER_MALE  
TRANSGENDER_FEMALE  
INTERSEX  
NON_BINARY

Usage:

state.selectedGenders  
UI gender selectors  
performer filtering

Immutability enforced with:

Object.freeze()

---

## 2. Country Code Mapping

### `COUNTRY_NAMES`

Maps **ISO country codes → full country names**.

Example:

"US" → "United States of America"  
"JP" → "Japan"  
"DE" → "Germany"

Purpose:

Display readable country names  
Convert performer country codes  
UI rendering

Structure:

{  
  ISO_CODE: "Country Name"  
}

Example:

COUNTRY_NAMES["US"]

Returns:

"United States of America"

---

## 3. Filter Modifier Types

### `ARRAY_BASED_MODIFIERS`

Defines filter operators that work on **arrays instead of single values**.

Contains:

INCLUDES  
EXCLUDES  
INCLUDES_ALL

Used by:

parsers.js  
filter builders  
GraphQL query construction

Example behavior:

|Modifier|Meaning|
|---|---|
|INCLUDES|item contains value|
|EXCLUDES|item does not contain value|
|INCLUDES_ALL|item contains all values|

Stored as:

Set

For fast lookup:

ARRAY_BASED_MODIFIERS.has(modifier)

---

## 4. Role in Plugin Architecture

`constants.js` provides **shared reference data** used by:

parsers.js  
ui-manager.js  
battle-engine.js  
state.js

Responsibilities:

Standardized gender values  
Country display names  
Filter modifier definitions

---

## 5. Design Notes

Key design choices:

Object.freeze() → prevents mutation  
Set() → fast modifier checks  
ISO country codes → consistent with APIs

Benefits:

Predictable filters  
Consistent UI labels  
Centralized constants

---

# `formatters.js` – UI Data Format Display

Purpose:  
Provides **utility functions for formatting data for UI display**.

This module converts **raw Stash data** into **safe, readable HTML/text** for the plugin interface.

---

## 1. Gender Formatter

### `getGenderDisplay(gender)`

Converts a **Stash gender enum** into a readable label.

Uses:

ALL_GENDERS

Example:

getGenderDisplay("TRANSGENDER_FEMALE")

Returns:

"Trans Female"

Fallback behavior:

return gender

If the value isn't in the constant list.

---

## 2. Duration Formatter

### `formatDuration(seconds)`

Converts **video duration (seconds)** into readable time.

Formats:

|Duration|Output|
|---|---|
|< 1 hour|`MM:SS`|
|≥ 1 hour|`H:MM:SS`|

Example:

formatDuration(95)

Returns:

"1:35"

Example:

formatDuration(3675)

Returns:

"1:01:15"

Fallback:

"N/A"

---

## 3. HTML Escaping

### `escapeHtml(unsafe)`

Prevents **HTML injection / XSS vulnerabilities**.

Escapes:

|Character|Replacement|
|---|---|
|`&`|`&amp;`|
|`<`|`&lt;`|
|`>`|`&gt;`|
|`"`|`&quot;`|
|`'`|`&#039;`|

```
Example:

escapeHtml("<script>")

Returns:

"&lt;script&gt;"
```

Used whenever **user or database text is inserted into HTML**.

---

## 4. Country Display Formatter

### `getCountryDisplay(countryCode)`

Converts **country codes into UI-friendly display** with a flag.

Uses:

COUNTRY_NAMES

Process:

1. Normalize code (uppercase)
    
2. Look up country name
    
3. Generate flag CSS class
    
4. Return HTML string
    

Example:

```
getCountryDisplay("US")

Returns:

<span class="fi fi-us"></span> United States of America

Flag system:

fi fi-<countrycode>

Example classes:
```
fi fi-us  
fi fi-jp  
fi fi-fr

Non-standard codes fallback:

escapeHtml(code)

---

## 5. Dependencies

Imports:

constants.js

Used constants:

COUNTRY_NAMES  
ALL_GENDERS

---

## 6. Role in Plugin Architecture

`formatters.js` is part of the **UI utility layer**.

Position in plugin flow:

Stash Data  
     ↓  
formatters.js  
     ↓  
ui-manager.js  
     ↓  
Rendered Cards

Responsibilities:

Gender display formatting  
Duration formatting  
HTML sanitization  
Country flag rendering

---

## 7. Design Characteristics

Key design decisions:

Stateless functions  
Pure formatting logic  
No API calls  
UI-safe output

Benefits:

Reusable UI helpers  
Consistent display formatting  
Prevents XSS  
Cleaner UI code

# `gauntlet-selection.js` – Gauntlet Mode Handler

Purpose:  
Handles **Gauntlet mode setup**, allowing users to **select the starting champion** and managing **placement screens after a run ends**.

This module connects **UI selection → game state → battle-engine**.

---

## 1. Role in Plugin Architecture

Position in plugin flow:

UI Manager  
   ↓  
gauntlet-selection.js  
   ↓  
battle-engine.js  
   ↓  
api-client.js  
   ↓  
Stash GraphQL

Responsibilities:

Champion selection  
Gauntlet initialization  
Placement screen rendering  
UI visibility control

---

## 2. Fetch Potential Champions

### `fetchPerformersForSelection(count)`

Fetches **random performers to choose as the starting champion**.

Steps:

Build performer filter  
Get total performer count  
Query random performers  
Shuffle locally  
Return limited selection

Uses:

getPerformerFilter()  
fetchPerformerCount()  
graphqlQuery()

Default selection size:

5 performers

---

## 3. Selection Card Template

### `createSelectionCard(performer)`

Generates HTML for **champion selection cards**.

Displayed data:

Performer image  
Performer name  
Current rating

Fallbacks:

Missing name → Performer #ID  
Missing image → "No Image"  
Missing rating → "Unrated"

HTML class:

hon-selection-card

---

## 4. Selection Screen Loader

### `loadPerformerSelection()`

Loads the **champion selection UI**.

Process:

Fetch candidate performers  
Render selection cards  
Attach click handlers  
Start gauntlet on selection

Event:

card.onclick → startGauntletWithPerformer()

Error handling:

Displays .hon-error message

---

## 5. Starting a Gauntlet Run

### `startGauntletWithPerformer(performer)`

Initializes **Gauntlet state**.

State updates:

state.gauntletChampion  
state.gauntletWins  
state.gauntletDefeated  
state.gauntletFalling

UI changes:

Hide selection screen  
Show battle area  
Show action buttons

Then starts battles:

loadNewPair()

---

## 6. Show Champion Selection Screen

### `showPerformerSelection()`

Displays the **Gauntlet setup interface**.

UI changes:

Show performer-selection container  
Hide comparison area  
Hide action buttons

Triggers:

loadPerformerSelection()

Also updates modal mode styling:

hon-mode-gauntlet

Removes:

hon-mode-champion  
hon-mode-swiss

---

## 7. Placement Screen

### `showPlacementScreen(item, rank, finalRating)`

Displays the **final placement screen after a Gauntlet run**.

Handles all battle types:

|Type|Title Source|Image Source|
|---|---|---|
|Performer|`item.name`|`image_path`|
|Image|`Image #ID`|`paths.thumbnail`|
|Scene|`title` or filename|`paths.screenshot`|

Displays:

Placement rank  
Final rating  
Total competitors

Example UI:

Rank #7 of 152  
Rating: 84/100

---

## 8. State Reset After Run

When placement screen appears:

state.gauntletFalling = false  
state.gauntletFallingItem = null  
state.gauntletChampion = null  
state.gauntletWins = 0  
state.gauntletDefeated = []

Allows user to start a new run.

---

## 9. Restart Button

Button:

#hon-new-gauntlet

Click action:

loadNewPair()

Also restores action buttons.

---

## 10. Dependencies

Imports:

api-client.js  
parsers.js  
state.js  
battle-engine.js

Key functions used:

graphqlQuery()  
fetchPerformerCount()  
getPerformerFilter()  
loadNewPair()

---

## 11. Data Flow

Champion selection flow:

showPerformerSelection()  
        ↓  
loadPerformerSelection()  
        ↓  
fetchPerformersForSelection()  
        ↓  
User selects performer  
        ↓  
startGauntletWithPerformer()  
        ↓  
loadNewPair()  
        ↓  
battle-engine.js matchmaking

---

## 12. Summary

`gauntlet-selection.js` manages **the start and end of Gauntlet runs**.

Main responsibilities:

Champion selection UI  
Gauntlet initialization  
Placement results screen  
UI visibility switching

It acts as the **entry and exit point for Gauntlet mode gameplay**.

# `hotornot.js` – Bootstrapper

Purpose:  
Acts as the **plugin bootstrap loader** for the HotOrNot Stash plugin.

It initializes the plugin by:

- loading core modules
    
- preventing duplicate loads
    
- exposing public functions to the Stash UI
    
- starting the plugin entry point
    

---

## 1. Role in Plugin Architecture

Position in plugin lifecycle:

Stash Plugin Loader  
        ↓  
hotornot.js  
        ↓  
main.js  
        ↓  
Plugin Modules

Responsibilities:

Plugin bootstrap  
Dynamic module loading  
Cache busting  
Global plugin exposure  
Startup execution

---

## 2. Self-Executing Loader

The file runs inside an **Immediately Invoked Async Function Expression (IIFE)**.

(async () => { ... })();

Purpose:

Allow async imports  
Run automatically when loaded  
Avoid global scope pollution

---

## 3. Double-Load Protection

Prevents the plugin from initializing twice.

Check:

if (window.hotOrNotLoaded) return;

Then sets:

window.hotOrNotLoaded = true;

Why needed:

Stash UI page reloads  
Hot module reloads  
Multiple script injections

---

## 4. Plugin Base Path

Defines the plugin’s static asset location inside Stash.

const folderPath = '/plugin/hot_or_not/javascript';

Used to load modules dynamically.

Example resolved path:

/plugin/hot_or_not/javascript/main.js

---

## 5. Cache Busting

Forces the browser to load **latest plugin changes**.

const version = Date.now();

Added to imports:

main.js?v=timestamp

Benefits:

Avoid browser caching  
See changes immediately  
Useful during development

---

## 6. Dynamic Module Loading

Loads core modules with `import()`.

### Main Entry

const { main } = await import(`${folderPath}/main.js?v=${version}`);

Purpose:

Primary plugin initialization  
Event wiring  
Modal setup  
State initialization

---

### UI Floating Button

const { addFloatingButton } = await import(`${folderPath}/ui-manager.js?v=${version}`);

Purpose:

Add HotOrNot button to Stash UI  
Open plugin modal

---

## 7. Global Plugin Interface

Exports selected functions to the **global window object**.

window.hotOrNot = { main, addFloatingButton };

Purpose:

Allow Stash UI to call plugin functions  
Enable external triggers  
Support debugging

Example usage:

window.hotOrNot.main()

---

## 8. Plugin Initialization

Runs the main entry function if available.

if (typeof main === 'function') {  
    main();  
}

Fallback:

console.log("[HotOrNot] Module loaded");

This allows compatibility with modules that **auto-execute on import**.

---

## 9. Error Handling

Entire loader is wrapped in `try/catch`.

If module loading fails:

console.error("HotOrNot failed to load dependencies:", err);

Common causes:

missing plugin files  
wrong folder path  
syntax errors in modules

---

## 10. CSS Injection

Imports plugin styling.

import './hotornot.css';

Purpose:

Load plugin UI styles  
Ensure styles bundle with JS

---

## 11. Initialization Flow

Full plugin startup sequence:

Stash loads hotornot.js  
        ↓  
Prevent duplicate load  
        ↓  
Import main.js  
Import ui-manager.js  
        ↓  
Expose window.hotOrNot  
        ↓  
Run main()  
        ↓  
Plugin UI becomes active

---

## 12. Summary

`hotornot.js` is the **plugin entry loader**.

Main responsibilities:

Bootstrap plugin  
Load core modules  
Prevent duplicate initialization  
Expose global API  
Start plugin

Without this file, **the rest of the plugin would never start**.

# `main.js` – DOM Manager, Runtime Controller

Purpose:  
Acts as the **central runtime controller** for the HotOrNot plugin.

It connects the **UI layer, battle system, and Stash page navigation** while managing **DOM injections and plugin lifecycle behavior**.

---

## 1. Role in Plugin Architecture

Position in system:

hotornot.js (bootstrap)  
        ↓  
main.js  
        ↓  
UI / Game Systems  
        ↓  
battle-engine.js  
api-client.js

Responsibilities:

Initialize plugin runtime  
Monitor page navigation  
Inject UI elements  
Attach global event handlers  
Coordinate modules

---

## 2. Global Function Exposure

For compatibility with **Stash UI hooks and inline HTML events**, several functions are exposed globally.

window.openRankingModal  
window.openStatsModal  
window.closeRankingModal  
window.handleGenderToggle  
window.showPerformerSelection  
window.handleChooseItem

Sources:

|Module|Function|
|---|---|
|`ui-manager.js`|ranking & stats modals|
|`gauntlet-selection.js`|performer selection|
|`match-handler.js`|battle choices|

Purpose:

Allow UI buttons and DOM events to trigger plugin functions

---

## 3. Navigation Tracking

Tracks page changes inside the **single-page Stash UI**.

let lastPath = "";

Used to detect:

Performer page navigation  
Badge reinjection

---

## 4. Mutation Observer

Main mechanism for detecting **DOM changes and page navigation**.

const observer = new MutationObserver(...)

Watches:

document.body

Options:

childList: true  
subtree: true

Purpose:

Detect SPA navigation  
Reinject UI when needed  
Maintain floating button  
Inject badges

---

## 5. Floating Button Control

Handles **HotOrNot floating action button** visibility.

Logic:

shouldShowButton()

Actions:

|Condition|Result|
|---|---|
|Invalid page|remove button|
|Valid page|add button|

Functions used:

UI.addFloatingButton()

---

## 6. Performer Rank Badge

Adds a **Battle Rank badge** on performer pages.

Detection:

UI.isOnSinglePerformerPage()

Injection:

UI.injectBattleRankBadge()

Delay used to ensure DOM readiness:

setTimeout(..., 300)

Prevents duplicates via:

#hon-battle-rank-badge

---

## 7. Main Dashboard Injection

When navigating to the **HotOrNot plugin page**, the main interface is injected.

Target container:

#stash-main-container

UI injection:

container.innerHTML = UI.createMainUI()

Event binding:

UI.attachEventListeners(container)

Prevent duplicate injection:

#hotornot-container

---

## 8. Plugin Initialization

### `main()`

Primary startup function.

Safety check:

if (window.honLoaded) return;

Sets:

window.honLoaded = true

Logs:

[HotOrNot] Global Scope Initialized

Then starts:

observer.observe()

---

## 9. Initial Performer Badge Check

When plugin loads, it immediately checks if the user is on a performer page.

UI.injectBattleRankBadge()

Delay:

1000ms

Purpose:

Ensure performer page DOM fully loads

---

## 10. Stash Event Integration

Hooks into **Stash plugin event system**.

Listener:

PluginApi.Event.addEventListener("stash:location")

Purpose:

Track navigation events  
Update performer filters

When navigating to performer pages:

state.cachedUrlFilter = getUrlPerformerFilter()

This allows battles to respect **active page filters**.

---

## 11. Dependencies

Modules used:

state.js  
ui-manager.js  
ui-modal.js  
gauntlet-selection.js  
match-handler.js  
api-client.js  
parsers.js

Key functionality:

|Module|Role|
|---|---|
|`ui-manager.js`|UI rendering|
|`gauntlet-selection.js`|gauntlet setup|
|`match-handler.js`|battle result logic|
|`api-client.js`|GraphQL communication|
|`parsers.js`|URL filter parsing|
|`state.js`|global plugin state|

---

## 12. Initialization Flow

Full runtime startup:

hotornot.js loads  
        ↓  
main.js executes  
        ↓  
MutationObserver starts  
        ↓  
Floating button injected  
        ↓  
Performer page badges added  
        ↓  
Plugin dashboard injected  
        ↓  
User interactions begin

---

## 13. Summary

`main.js` acts as the **runtime coordinator** for the plugin.

Core responsibilities:

Monitor page navigation  
Inject UI components  
Maintain plugin elements  
Expose global handlers  
Connect Stash events

Without `main.js`, the plugin would **not react to navigation or render its interface dynamically inside Stash.**

# `match-handler.js` – Handles Battle Outcomes & Progression

Purpose:  
Handles **battle outcomes and game progression** when a user selects a winner (or skips a match).

It acts as the **interaction controller between the UI and the battle logic**.

---

## 1. Role in Plugin Architecture

Position in system:

UI Click  
   ↓  
match-handler.js  
   ↓  
api-client.js (ELO calculation)  
   ↓  
battle-engine.js (next match)

Responsibilities:

Handle winner selection  
Apply game-mode logic  
Update ratings  
Update gauntlet/champion state  
Trigger animations  
Load next matchup

---

## 2. Main Entry Point

### `handleChooseItem(event)`

Triggered when the user clicks a battle card.

Initial safeguards:

if (state.disableChoice) return;

Prevents:

double clicks  
race conditions  
duplicate rating updates

Then determines:

winner item  
loser item  
winner rating  
loser rating

Using:

state.currentPair  
state.currentRanks

---

## 3. Mode-Based Battle Logic

The handler branches based on **battle type and mode**.

---

### Image Battles

Images only use **Swiss-style ranking**.

Process:

handleComparison()  
applyVisualFeedback()

No special state updates.

---

### Gauntlet Mode

Gauntlet has **two states**:

---

#### A. Falling State

Occurs when a champion **loses and must find their placement floor**.

Triggered by:

state.gauntletFalling

Logic:

|Result|Outcome|
|---|---|
|Falling item wins|placement found|
|Falling item loses|continue falling|

Placement rating:

loserRating + 1

Then shows:

showPlacementScreen()

---

#### B. Normal Gauntlet Climb

Winner becomes or remains champion.

Handled via:

handleComparison()  
updateGauntletState()

Champion progression tracked via:

state.gauntletChampion  
state.gauntletWins  
state.gauntletDefeated

---

### Champion Mode

Simplified version of Gauntlet.

Rule:

Winner stays champion

Handled via:

updateChampionModeState()

---

### Swiss Mode

Default battle system.

Process:

handleComparison()  
applyVisualFeedback()

No persistent champion.

---

## 4. Gauntlet State Updates

### `updateGauntletState()`

Handles champion progression.

Cases:

|Scenario|Result|
|---|---|
|Champion wins|increase streak|
|Challenger wins|new champion|
|Champion loses|trigger falling state|

Key state updates:

state.gauntletChampion  
state.gauntletWins  
state.gauntletDefeated  
state.gauntletFalling  
state.gauntletFallingItem

---

## 5. Champion Mode State

### `updateChampionModeState()`

Similar to Gauntlet but **without falling logic**.

Rules:

Winner becomes champion  
Champion keeps fighting

State updated:

state.gauntletChampion  
state.gauntletWins  
state.gauntletDefeated

---

## 6. Skip / Tie System

### `handleSkip()`

Triggered when user **skips a battle**.

Behavior depends on mode.

---

### Swiss Mode

Skip becomes a **draw**.

Calls:

handleComparison(..., isDraw=true)

This updates both ratings fairly.

---

### Other Modes

Skip simply loads a new match.

loadNewPair()

---

## 7. Visual Feedback

### `applyVisualFeedback()`

Handles battle result animations.

UI effects:

winner highlight  
loser highlight  
rating change animation

Uses:

showRatingAnimation()

Adds classes:

hon-winner  
hon-loser

---

## 8. Match Transition

After animations complete:

setTimeout(() => loadNewPair(), 1500)

This keeps the battle loop running.

---

## 9. Dependencies

Imports:

state.js  
api-client.js  
ui-manager.js  
battle-engine.js

Key functions used:

handleComparison()  
updateItemRating()  
showRatingAnimation()  
loadNewPair()  
showPlacementScreen()

---

## 10. Data Flow

Battle resolution flow:

User clicks card  
      ↓  
handleChooseItem()  
      ↓  
Determine winner/loser  
      ↓  
handleComparison() (ELO update)  
      ↓  
Update gauntlet/champion state  
      ↓  
Apply animations  
      ↓  
loadNewPair()

---

## 11. Summary

`match-handler.js` controls **what happens after a battle decision**.

Core responsibilities:

Process winner selection  
Apply mode-specific logic  
Update ratings  
Manage champion/gauntlet state  
Trigger animations  
Advance battles

It acts as the **gameplay interaction engine** of the HotOrNot plugin.


# `math-utils.js` – Rating & Matchmaking Utilities

Purpose:  
Contains **pure functions for calculating ELO ratings, weighting, and stats**.  
Used throughout HotOrNot to determine match outcomes, streaks, and participant selection.

---

## 1. Recency Weighting

### `getRecencyWeight(performer)`

Calculates **how recently a performer has competed** to adjust selection probability.

Logic:

|Hours since last match|Weight|
|---|---|
|< 1|0.1|
|< 6|0.3|
|< 24|0.6|
|≥ 24|1.0|

Returns: `0.1 – 1.0`

Used by **weighted random selection** to favor less-recent performers.

---

## 2. Weighted Random Selection

### `weightedRandomSelect(items, weights)`

Selects an item **randomly but weighted by provided values**.

- Parameters:
    
    - `items` – array of items
        
    - `weights` – corresponding array of numeric weights
        
- Returns: one randomly selected item
    

Behavior:

- If `totalWeight <= 0`, defaults to uniform random selection.
    
- Iterates cumulatively to find the weighted pick.
    

---

## 3. Random Opponent Selection

### `selectRandomOpponent(remainingOpponents, maxChoices = 3)`

Chooses a random opponent from the **closest subset** of remaining options:

- Defaults to **last `maxChoices` elements**
    
- Ensures faster matches between similar-rated or recently active performers
    

---

## 4. Parsing Performer Stats

### `parsePerformerEloData(performer)`

Extracts ELO-related stats from `performer.custom_fields`.

Default structure:

{  
  total_matches: 0,  
  wins: 0,  
  losses: 0,  
  draws: 0,  
  current_streak: 0,  
  best_streak: 0,  
  worst_streak: 0,  
  last_match: null  
}

- Supports JSON string `hotornot_stats`
    
- Fallback: `elo_matches` for backward compatibility
    

---

## 5. Updating Stats After a Match

### `updatePerformerStats(currentStats, won)`

Updates a performer’s **match stats and streaks**.

- `won = true/false` updates wins/losses and streaks
    
- `won = null` increments **draws**
    
- Updates:
    
    - `current_streak`
        
    - `best_streak`
        
    - `worst_streak`
        
    - `last_match` timestamp
        

---

## 6. K-Factor Calculation

### `getKFactor(currentRating, matchCount = null, mode = "swiss")`

Determines **how much a match affects rating**.

- `matchCount < 10 → 16`
    
- `matchCount < 30 → 12`
    
- Otherwise → `8`
    

If `mode === "champion"`, reduces K by 50% (min 1).

---

## 7. Active Participant Check

### `isActiveParticipant(performerId, mode, gauntletChampion, gauntletFallingItem)`

Determines if a performer **should participate in the current mode**.

- Swiss / Champion → always true
    
- Gauntlet → only if champion or falling item
    

---

## 8. Calculate Match Outcome

### `calculateMatchOutcome({...})`

Calculates **rating gain/loss** after a battle.

Parameters:

- `winnerRating`, `loserRating`
    
- `mode` (`swiss` | `champion` | `gauntlet`)
    
- `winnerMatchCount`, `loserMatchCount`
    
- Flags: `isChampionWinner`, `isFallingWinner`, `isChampionLoser`, `isFallingLoser`
    
- `loserRank` (used for Gauntlet floor logic)
    

Returns:

{ winnerGain, loserLoss }

Logic:

- Computes **expected winner probability** using standard ELO formula:
    

expectedWinner = 1 / (1 + 10^(ratingDiff/400))

- Applies **mode-specific K-factors**:
    

|Mode|Notes|
|---|---|
|Swiss|Standard K-factor per match|
|Champion|K-factor reduced by 50%|
|Gauntlet|Only champion/falling items affected|
|Floor|LoserRank = 1 → minimum rating loss = 1|

---

## 9. Summary

`math-utils.js` provides:

- ELO and streak calculation
    
- Weighted random opponent selection
    
- Recency-based matchmaking
    
- Stat parsing and updating
    
- K-factor logic for different modes
    

Essentially, it’s the **core math engine of HotOrNot**, separated from UI and state logic.

# `parsers.js` – URL Filter Parsing & GraphQL Conversion

Purpose:  
Handles **parsing URL query parameters**, normalizing values, and converting them into **GraphQL-ready performer filters**.  
Supports the HotOrNot plugin in filtering performers based on URL state and selected genders.

---

## 1. Parse URL Criteria

### `parseUrlFilterCriteria()`

Extracts `c` query parameters from the URL and **parses them into criterion objects**.

- Handles:
    
    - JSON-encoded criteria
        
    - Custom Stash parenthesis encoding `()` → `{}`
        
    - Multi-part criteria separated by `},{`
        
- Returns: `Array` of criterion objects
    

[  
  { type: "gender", value: "FEMALE" },  
  { type: "tags", value: { items: [1, 2, 3] } },  
  ...  
]

---

## 2. Value Extraction & Normalization

### `extractSimpleValue(value)`

- Extracts the inner `.value` if the object has one
    
- Returns primitives as-is
    

---

### `safeParseInt(value, defaultValue = 0)`

- Safely parses integers from primitive or `{ value, value2 }` objects
    
- Returns `defaultValue` if parsing fails
    

---

### `normalizeGenderValue(value)`

- Converts gender strings to **GraphQL GenderEnum format**:
    
    - `MALE`, `FEMALE`, `TRANSGENDER_MALE`, `TRANSGENDER_FEMALE`, `INTERSEX`, `NON_BINARY`
        
- Invalid values are logged and returned as-is
    

---

### Internal Helper

#### `createNumericFilterObject(value, modifier, defaultModifier)`

- Converts a number (or object with `value`/`value2`) into a **GraphQL numeric filter**:
    

{ value: 18, value2: 30, modifier: "GREATER_THAN" }

---

## 3. Convert Criterion → GraphQL Filter

### `convertCriterionToFilter(criterion)`

- Converts a single parsed criterion object into a **GraphQL-compatible filter**.
    
- Handles types:
    

|Type|Notes|
|---|---|
|tags, studios|Array of IDs, optional depth|
|gender|Supports single or multiple with modifier|
|favorite, filter_favorites|Boolean|
|rating, rating100, age, scene_count, image_count, gallery_count, o_counter|Numeric filter|
|ethnicity, country, hair_color, eye_color|Single value filter|
|stash_id, stash_id_endpoint|Object with optional endpoint|
|is_missing|Boolean|
|name, aliases, details, career_length, tattoos, piercings, url, birthdate, death_date, created_at, updated_at|Text/date filters|
|default|Logs unknown types|

---

## 4. High-Level Filter Builders

### `getUrlPerformerFilter()`

- Parses URL criteria using `parseUrlFilterCriteria()`
    
- Converts each criterion via `convertCriterionToFilter()`
    
- Returns full GraphQL `PerformerFilterType` object
    

---

### `getPerformerFilter(cachedUrlFilter, selectedGenders)`

- Builds **active performer filter** for the UI:
    
    - Applies cached URL filters
        
    - Applies selected gender list
        
    - Excludes performers missing images if no other filters are active
        

---

### `getPerformerFilterForGender(gender, cachedUrlFilter = {})`

- Restricts filter to **single exact gender** for same-gender battles
    
- Excludes performers missing images if no other URL filters are active
    

---

### 5. Summary

`parsers.js` handles:

1. **Robust URL parsing** for Stash filter parameters
    
2. **Value normalization** (gender, numeric, boolean, text)
    
3. **GraphQL conversion** for all supported criteria types
    
4. High-level filter helpers for **battle modes**, gender selection, and default exclusions
    

---Here’s a **structured summary and explanation for `state.js`**:

---

# `state.js` – Global State Management

Purpose:  
Acts as the **single source of truth** for the HotOrNot plugin. All modules read from and write to this object to maintain **battle state, mode, filters, and UI context**.

---

## 1. Current Matchup

currentPair: { left: null, right: null },  
currentRanks: { left: null, right: null },

- **currentPair**: holds the two items (performers/scenes/images) currently being compared.
    
- **currentRanks**: optional pre-calculated ranks for the left/right items.
    

---

## 2. App Configuration & Context

currentMode: "swiss",       // "swiss" | "gauntlet" | "champion"  
battleType: "performers",   // "performers" | "scenes" | "images"  
totalItemsCount: 0,         // Total items in current battle  
disableChoice: false,       // Temporarily disables user selection during animations

- `currentMode` determines **battle rules**:
    
    - **Swiss**: standard bracketless matches
        
    - **Gauntlet**: one champion vs sequential challengers
        
    - **Champion**: repeated battles with same winner
        
- `battleType` defines the type of content being rated.
    

---

## 3. Gauntlet / Champion Mode Progress

gauntletChampion: null,  
gauntletWins: 0,  
gauntletChampionRank: 0,  
gauntletDefeated: [],  
gauntletFalling: false,  
gauntletFallingItem: null,

- `gauntletChampion`: the current champion performer/item.
    
- `gauntletWins`: count of consecutive wins for the champion.
    
- `gauntletDefeated`: array of defeated performer IDs.
    
- `gauntletFalling` & `gauntletFallingItem`: track the “falling” item during gauntlet mode (loser descending).
    
- `gauntletChampionRank`: final ranking once the gauntlet ends.
    

---

## 4. Filters & Settings

cachedUrlFilter: null,        // URL-based performer filter  
badgeInjectionInProgress: false, // Tracks badge UI injection  
pluginConfigCache: null,      // Cached plugin settings  
selectedGenders: ["FEMALE", "NON_BINARY"], // Currently active gender filter

- `cachedUrlFilter` holds **pre-calculated filters** for GraphQL queries.
    
- `selectedGenders` allows **multi-gender filtering** for Swiss battles.
    

---

## 5. Utility Function

### `resetBattleState()`

Resets only the **gauntlet-specific state** without touching the global app configuration:

resetBattleState();

After calling:

- `gauntletChampion = null`
    
- `gauntletWins = 0`
    
- `gauntletDefeated = []`
    
- `gauntletFalling = false`
    
- `gauntletFallingItem = null`
    
- `gauntletChampionRank = 0`
    

This is useful for **starting a new gauntlet run**.

---

### ✅ Summary

`state.js` centralizes all runtime data:

- Current matchup (`currentPair`, `currentRanks`)
    
- Battle configuration (`currentMode`, `battleType`)
    
- Gauntlet/Champion progress
    
- Filters and settings (`cachedUrlFilter`, `selectedGenders`)
    

Modules like `match-handler.js`, `gauntlet-selection.js`, and `math-utils.js` all **read/write here**, ensuring consistent behavior across the plugin.

# `ui-badge.js` – UI Helpers for Badges, Placement, and Animations

This module handles **visual elements**:

1. **Performer Battle Rank Badges**
    
2. **Placement Screen (Victory UI)**
    
3. **Rating Change Animations**
    

It is heavily used by `main.js` and `match-handler.js` to **update the UI after matches**.

---

## 1. Performer Page Detection

export function isOnSinglePerformerPage() {  
  return window.location.pathname.includes('/performers/') &&  
         !window.location.pathname.endsWith('/performers');  
}

- Checks if the current page is a **single performer page** (not the full performer list).
    
- Used to decide whether to inject the battle rank badge.
    

---

## 2. Battle Rank Badge

### `createBattleRankBadge(rank, total, rating, stats)`

- Creates a DOM element displaying the **performer's rank, total performers, rating, and match stats**.
    
- Shows **tier emojis** based on percentile:
    
    - 👑 ≥95%
        
    - 🥇 ≥80%
        
    - 🥈 ≥60%
        
    - 🥉 ≥40%
        
    - 🔥 default
        
- Includes optional **match stats**:
    
    - Wins/Losses/Draws
        
    - Win Rate
        
    - Current, Best, Worst streaks
        
- Adds **tooltip** summarizing the same information.
    

### `injectBattleRankBadge()`

- Detects the performer ID from the URL.
    
- Fetches rank via `getPerformerBattleRank(performerId)` (from `api-client.js`).
    
- Injects badge into `.quality-group` element.
    
- Prevents **duplicate injections** with `window._honBadgeInjectionInProgress`.
    

---

## 3. Placement Screen

### `showPlacementScreen(item, rank, finalRating, battleType, totalItemsCount)`

- Shows a **victory/placement UI** after an item finishes a run.
    
- Displays:
    
    - Title or performer name
        
    - Image (performer, scene, or thumbnail)
        
    - Rank & rating
        
    - “Start New Run” button
        
- Resets gauntlet state:
    
    state.gauntletFalling = false;  
    state.gauntletFallingItem = null;  
    state.gauntletChampion = null;  
    state.gauntletWins = 0;  
    state.gauntletDefeated = [];
    
- Wires restart button to `loadNewPair()`.
    

---

## 4. Rating Change Animation

### `showRatingAnimation(card, oldRating, newRating, change, isWinner)`

- Adds an overlay to the card showing **rating change**.
    
- Animates number increase/decrease step by step:
    
    - Winner: increments
        
    - Loser: decrements
        
- Removes overlay after 1.4s.
    
- Visualizes impact of match on each performer’s rating.
    

---

### ✅ Summary

- **UI Focused**: Only responsible for **display logic**, never alters battle state.
    
- **Integrates With**:
    
    - `state.js` for resetting gauntlet status
        
    - `match-handler.js` for winner/loser animations
        
    - `api-client.js` to fetch rank info
        
- **Key Concepts**:
    
    - Dynamic badges with stats and emoji tiers
        
    - Placement screens for end-of-run visualization
        
    - Smooth rating change animations

# `ui-cards.js` – Card Rendering & Victory Screen

This module handles **dynamic creation of HTML cards** for battles. It works closely with `state.js` and `formatters.js` to render **performers, images, and scenes**.

---

## 1. Generic Card Entry

export function renderCard(item, side, rank) {  
  const streak = (state.gauntletChampion?.id === item.id) ? state.gauntletWins : null;  
  if (state.battleType === "performers") return createPerformerCard(item, side, rank, streak);  
  if (state.battleType === "images") return createImageCard(item, side, rank, streak);  
  return createSceneCard(item, side, rank, streak);  
}

- **`renderCard`** decides which type of card to create based on `state.battleType`.
    
- Computes `streak` for **gauntlet champions**.
    

---

## 2. Scene Cards

export function createSceneCard(scene, side, rank = null, streak = null) { ... }

- Displays:
    
    - **Title**, **studio**, **performers**
        
    - **Screenshot or placeholder**, optional hover video preview
        
    - **Duration** (via `formatDuration`)
        
    - **Rating** (`scene.rating100` or default 50)
        
    - Optional **rank and streak badges**
        
    - **"Choose This Scene"** button
        
- Uses `data-scene-id` and `data-side` for event handling.
    

---

## 3. Performer Cards

export function createPerformerCard(performer, side, rank = null, streak = null) { ... }

- Displays:
    
    - Name, country, gender, rating
        
    - Profile image (or placeholder) with link to performer page
        
    - Rank and streak badge if applicable
        
    - **"Choose This Performer"** button
        
- Uses `data-performer-id` and `data-side` for interaction.
    
- Relies on helpers from `formatters.js`:
    
    - `getCountryDisplay()`
        
    - `getGenderDisplay()`
        

---

## 4. Image Cards

export function createImageCard(image, side, rank = null, streak = null) { ... }

- Displays:
    
    - Thumbnail image (or placeholder)
        
    - Optional rank overlay
        
    - Streak badge
        
    - **"Choose This Image"** button
        
- Uses `data-image-id` for event binding.
    

---

## 5. Victory / Champion Screen

export function createVictoryScreen(champion) { ... }

- Used at the **end of a gauntlet run** to show champion.
    
- Displays:
    
    - Image or placeholder
        
    - Name or title
        
    - Total items conquered and win count
        
    - Button to **start a new gauntlet**
        
- Adapts to **performers, images, or scenes**.
    

---

### ✅ Key Points

- **UI-Focused Module**: Responsible only for **HTML generation**, no state mutation.
    
- Supports all three battle types (`performers`, `images`, `scenes`).
    
- Provides **rank & streak indicators** for gauntlet mode.
    
- Works in combination with `ui-badge.js` (rating animations) and `match-handler.js` (battle logic).
    
- **Victory screens** allow seamless transition from run completion to next round.
    

---

---

# `ui-dashboard.js` – Main Dashboard & Event Handling

This module handles **rendering the main HotOrNot UI** and wiring up interactions for **mode switches, gender filters, and skips**.

---

## 1. Main UI Creation

export function createMainUI() { ... }

- Builds the **HotOrNot container** HTML, including:
    
    - **Header:** Title + mode toggle + gender filters + stats button
        
    - **Comparison area:** Where battle cards are shown
        
    - **Action buttons:** Skip button
        
    - **Keyboard hints:** Left/right arrow + space
        
- Uses `state.battleType` and `state.selectedGenders` to adjust:
    
    - Only show gender buttons for **performers**
        
    - Mode toggle visible for all except **images**
        
    - Stats button only for **performers**
        
- **Mode Icons**:
    
    - Swiss: ⚖️
        
    - Gauntlet: 🥊
        
    - Champion: 👑
        

---

## 2. Attaching Event Listeners

export function attachEventListeners(parent = document) { ... }

- **Stats button**: Lazy imports `ui-stats.js` to avoid circular dependency.
    
- **Prevent click bubbling** for performer links.
    
- **Skip button**: Only visible in Swiss mode; calls `handleSkip()` from `match-handler.js`.
    
- **Gender buttons**: Toggles filters via `handleGenderToggle()`.
    
- **Mode buttons**: Switches between `swiss`, `gauntlet`, and `champion` modes:
    
    - Resets gauntlet state (`state.gauntletChampion`, `state.gauntletFalling`, etc.)
        
    - Re-renders main UI dynamically
        
    - Loads either performer selection or a new pair, depending on mode.
        

---

## 3. Gender Filter Toggle

export function handleGenderToggle(gender) { ... }

- Updates `state.selectedGenders` when a gender button is clicked.
    
- Updates button styling (`active` class).
    
- Calls `loadNewPair()` to refresh the battle with the new filter applied.
    

---

## 4. Mode Setter

export function setMode(mode) { ... }

- Helper to hide UI containers and display **performer selection** if in gauntlet mode.
    
- Lazy imports `gauntlet-selection.js` to show selection screen.
    

---

### ✅ Key Points

- **Dynamic UI Module**: Focuses on **dashboard layout and event wiring**.
    
- Interfaces with:
    
    - `state.js` – for selected genders, mode, and battle type
        
    - `match-handler.js` – for skip action
        
    - `battle-engine.js` – to load new matchups
        
    - `ui-modal.js` – for modal interactions
        
- Handles **lazy imports** to avoid circular dependencies.
    
- Fully responsive to **mode switches and filter changes**.


# `ui-manager.js` – UI Barrel Export

This module is essentially a **centralized re-export layer**. It does **not contain logic itself**, but instead:

- Keeps **all old import paths working**.
    
- Organizes UI functionality into **focused submodules**.
    
- Provides a **single entry point** for the entire UI layer.
    

---

## 1. What It Re-exports

|Submodule|Key Exports|Responsibility|
|---|---|---|
|`ui-cards.js`|`renderCard`, `createSceneCard`, `createPerformerCard`, `createImageCard`, `createVictoryScreen`|Templates for battle cards and victory screens|
|`ui-dashboard.js`|`createMainUI`, `attachEventListeners`, `handleGenderToggle`, `setMode`|Main dashboard UI, mode/gender toggles, skip button|
|`ui-modal.js`|`shouldShowButton`, `addFloatingButton`, `openRankingModal`, `closeRankingModal`|Floating UI button, modal open/close, keyboard navigation|
|`ui-stats.js`|`openStatsModal`, `createStatsModalContent`, `generateStatTables`, `generateBarGroups`|Stats modal, leaderboard tables, rating distribution charts|
|`ui-badge.js`|`isOnSinglePerformerPage`, `createBattleRankBadge`, `injectBattleRankBadge`, `showPlacementScreen`, `showRatingAnimation`|Performer page badges, placement screen, rating animations|

---

## 2. Key Points

- Makes imports cleaner:
    
    import { createMainUI, renderCard, injectBattleRankBadge } from './ui-manager.js';
    
    Instead of importing from **five separate files**.
    
- Keeps **submodule responsibilities separate**, so each file is focused on:
    
    - Rendering templates (`ui-cards.js`)
        
    - Dashboard & event wiring (`ui-dashboard.js`)
        
    - Modals (`ui-modal.js`)
        
    - Stats (`ui-stats.js`)
        
    - Performer badges (`ui-badge.js`)
        
- Ensures **backward compatibility** for any existing code that used direct imports.
    

---

# `ui-modal.js` – Navigation & Modal Control

This module handles the **floating HotOrNot button**, the **main ranking modal**, and **keyboard navigation** within the modal.

---

## 1. Floating Button

**`shouldShowButton()`**

- Determines whether the floating HotOrNot button should appear.
    
- Only shows on performer or image pages (`/^\/performers/` or `/^\/images/`).
    

**`addFloatingButton()`**

- Creates a floating 🔥 button (`hon-floating-btn`) if it doesn’t exist and `shouldShowButton()` returns true.
    
- Clicking it triggers `window.openRankingModal()` to open the modal.
    

---

## 2. Global Keyboard Handling

**`handleGlobalKeys(e)`**

- Listens for key events **only when the modal is open**.
    
- Key mappings:
    
    - `ArrowLeft` → chooses the left card
        
    - `ArrowRight` → chooses the right card
        
    - `Space` → triggers the Skip button
        
- Stops event propagation and prevents default behavior to avoid interference with the page.
    

---

## 3. Modal Creation & Management

**`_buildAndOpenModal()`** (internal helper)

- Removes any existing modal (`hon-modal`) first.
    
- Creates a new modal structure with backdrop and content.
    
- Inserts **main UI** (`createMainUI()`) into the modal content.
    
- Attaches event listeners (`attachEventListeners(modal)`).
    
- Handles **Gauntlet mode pre-seeding**:
    
    - If `state.gauntletChampion` exists, skip the selection screen.
        
    - Otherwise, shows performer selection screen via `window.showPerformerSelection()`.
        
- Adds global keyboard handling.
    

---

## 4. Public Modal API

**`openRankingModal()`**

- Determines current `battleType` based on URL (`/images` → images, else performers).
    
- If on a **single performer page in Gauntlet mode**, pre-seeds that performer as champion by fetching it from the API.
    
- Calls `_buildAndOpenModal()` to render the modal.
    

**`closeRankingModal()`**

- Removes both the **game modal** (`hon-modal`) and **stats modal** (`hon-stats-modal`) if present.
    
- Removes the global keyboard event listener to prevent key capture after closing.
    

---

## 5. Key Features

- Modal is **fully dynamic**: updates UI depending on `state.currentMode` and `state.battleType`.
    
- Keyboard-friendly: allows battles without a mouse.
    
- Supports **pre-seeding a performer** in Gauntlet mode directly from the performer page.
    
- Encapsulates modal behavior, keeping dashboard and UI logic modular.
    

---

In short, **`ui-modal.js` manages the interactive overlay that drives HotOrNot gameplay**, including:

- Floating button
    
- Ranking modal
    
- Keyboard shortcuts
    
- Pre-seeding champion in Gauntlet mode

---

# `ui-stats.js` – Stats Modal & Leaderboards

This module handles the **statistics modal** for performers, including leaderboards, rating distributions, collapsible groups, and tab navigation.

---

## 1. Opening the Stats Modal

**`openStatsModal()`**

- Checks if the modal already exists (`hon-stats-modal`) and removes it.
    
- Creates a new modal structure with backdrop and dialog container:
    

<div id="hon-stats-modal" class="hon-stats-modal">  
  <div class="hon-modal-backdrop"></div>  
  <div class="hon-stats-modal-dialog">  
    <button class="hon-modal-close">✕</button>  
    <div class="hon-stats-loading">Loading stats...</div>  
  </div>  
</div>

- Adds event listeners:
    
    - Clicking backdrop closes modal
        
    - Clicking close button closes modal
        
    - Clicks inside the dialog **do not propagate**
        
- Fetches all performer stats asynchronously using `fetchAllPerformerStats()`.
    
- Renders modal content using `createStatsModalContent(performers)`.
    
- Initializes tabs (`initStatsTabs`) and collapsible groups (`initStatsCollapsibles`).
    
- If fetching fails, shows a "Failed to load statistics" message.
    

---

## 2. Rendering Stats Content

**`createStatsModalContent(performers)`**

- Returns empty placeholder if no performers exist.
    
- Processes each performer using `parsePerformerEloData(p)` and normalizes rating (`p.rating100 / 10`).
    
- Generates:
    
    - **Leaderboard** tables via `generateStatTables()`
        
    - **Rating distribution** bars via `generateBarGroups()`
        
- Organizes content into **tabs**:
    

<div class="hon-stats-tabs">  
  <button data-tab="leaderboard">Leaderboard</button>  
  <button data-tab="distribution">Rating Distribution</button>  
</div>

- Default active tab is **Leaderboard**.
    

---

## 3. Leaderboard Table

**`generateStatTables(processedPerformers)`**

- Groups performers into chunks of 250 to avoid huge tables.
    
- For each chunk:
    
    - Builds a collapsible rank group with header: `Ranks 1-250`, `Ranks 251-500`, etc.
        
    - Table columns: Rank, Name, Rating, Matches, Wins, Losses, Draws, Win %, Streak, Best, Worst.
        
- Streaks styled with `hon-stats-positive` or `hon-stats-negative`.
    
- Collapsible groups allow users to expand/collapse large leaderboards.
    

---

## 4. Rating Distribution Graph

**`generateBarGroups(ratingBuckets)`**

- Input: array of counts of performers at each rating 0–100.
    
- If data is heavily clustered (top bucket >50% of total), groups ratings into 5-point ranges to improve readability.
    
- Generates horizontal bars with width proportional to performer count.
    
- Shows count if above a threshold (e.g., `>2` for clustered groups).
    

---

## 5. Internal Helpers

**`initStatsTabs(dialog)`**

- Handles tab switching between **Leaderboard** and **Rating Distribution**.
    
- Toggles `active` class on buttons and panels.
    

**`initStatsCollapsibles(dialog)`**

- Handles expand/collapse behavior for both:
    
    - Leaderboard groups (`hon-rank-group-header`)
        
    - Rating bar groups (`hon-bar-group-header`)
        
- Toggles arrow icons (`▶` / `▼`) and `aria-expanded` attribute.
    

---

## 6. Summary of Features

- Fully **interactive modal** for performer stats.
    
- Handles **large datasets** with grouped leaderboards.
    
- Provides **visual rating distributions**.
    
- Tabs and collapsibles make navigation smooth and intuitive.
    
- Integrates tightly with **`api-client.js`** and **`math-utils.js`** for accurate stats.
    

---

|Module|Purpose|
|---|---|
|`state.js`|Global app state|
|`ui-badge.js`|Battle-rank badges, placement screens, rating animations|
|`ui-cards.js`|Render cards (performer, scene, image), victory screens|
|`ui-dashboard.js`|Main UI shell, gender/mode controls, event listeners|
|`ui-manager.js`|Barrel export for all UI modules|
|`ui-modal.js`|Floating button, ranking modal, keyboard navigation|
|`ui-stats.js`|Stats modal, leaderboards, rating distribution|
