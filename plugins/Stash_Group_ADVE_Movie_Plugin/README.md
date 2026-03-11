# Movie Scene Checker — Stash Plugin

Compares the scenes inside a Stash **Group** (Movie) against the scene listing
on **AdultDVDEmpire**, so you can see at a glance which scenes you own and
which you're still missing.

---

## Requirements

| Requirement | Notes |
|---|---|
| Stash v0.25+ | Plugin API + patch system |
| Python 3.10+ | Backend scraper |
| `requests`, `beautifulsoup4` | `pip install -r requirements.txt` |

---

## Installation

1. Install via manager or manually pasting the folder into Stash's 
   plugin directory. Installation documentation found here:
   https://discourse.stashapp.cc/t/how-to-install-a-plugin/1015

2. Edit `config.json` with your settings (see **Configuration** below).

3. In Stash → **Settings → Plugins**, click **Reload Plugins**.
   You should see **Stash Group ADVE Movie Checker** appear in the list.

4. Open any Group page — a **🎬 Scene Checker** button will appear below
   the Edit/Delete buttons.

---

## Configuration

All settings live in `config.json` inside the plugin folder. Open it in any
text editor and fill in the three values:

```json
{
  "stash_url": "http://localhost:9999",
  "stash_api_key": "",
  "adve_session_cookie": "ageConfirmed=true; defaults={}; etoken=PASTE_YOUR_ETOKEN_HERE"
}
```

| Key | Description |
|---|---|
| `stash_url` | URL of your Stash instance. Change if you use a custom port or remote host. |
| `stash_api_key` | API key for your Stash instance. Leave blank if authentication is not enabled. |
| `adve_session_cookie` | Your AdultDVDEmpire session cookie string. See instructions below. |

### How to get your AdultDVDEmpire session cookie

The plugin needs a valid session cookie to access ADVE movie pages.
You only need to do this once — the `etoken` cookie persists until you log out.

1. Open your browser and log into [adultdvdempire.com](https://www.adultdvdempire.com).

2. Open **Developer Tools**:
   - **Chrome / Edge**: press `F12` or `Ctrl+Shift+I` (Mac: `Cmd+Option+I`)
   - **Firefox**: press `F12` or `Ctrl+Shift+I`

3. Click the **Application** tab (Chrome/Edge) or **Storage** tab (Firefox).

4. In the left sidebar, expand **Cookies** and click
   `https://www.adultdvdempire.com`.

5. You will see a table of cookies. Locate these three:

   | Cookie name | Example value |
   |---|---|
   | `ageConfirmed` | `true` |
   | `defaults` | `{}` |
   | `etoken` | `a1=abc123...&a2=def456...&a3=789...` |

6. Build the cookie string by combining all three in this format:
   ```
   ageConfirmed=true; defaults={}; etoken=PASTE_FULL_ETOKEN_VALUE_HERE
   ```
   Paste the **full value** of `etoken` exactly as shown in DevTools —
   it is a long string containing `a1=`, `a2=`, and `a3=` parts.

7. Paste the complete string as the value of `adve_session_cookie` in
   `config.json` and save the file. No plugin reload required.

> **Note:** If the scraper ever stops getting through to ADVE, your `etoken`
> may have expired. Repeat steps 1–7 with a freshly logged-in session.

---

## Usage

### Per-Group check (normal use)

1. Open any Group (movie) page in Stash.
2. Click the **🎬 Scene Checker** button below the Edit/Delete buttons.
   The panel expands showing a **Check Scenes** button.
3. The Group must have an `adultdvdempire.com` URL in its URL list.
   Click **Check Scenes** — the plugin scrapes ADVE and compares the results
   against scenes already linked to this Group in Stash.
4. Use the **All / Missing / In Library** filter buttons to narrow the view.
5. Click **✕** to collapse the panel back to button mode. Results are saved
   to disk and will restore automatically the next time you open the page.

### No ADVE URL

If the Group does not have an `adultdvdempire.com` URL in its URL list, the
panel shows a warning. Edit the Group, paste the ADVE movie page URL into
the URL field, save, then click **Check Scenes**.

### Bulk scrape (background task)

In **Settings → Tasks**, run **"Scrape ADVE Scenes for All Groups"** to
pre-cache scene data for every Group that already has an ADVE URL. Note:
this task can take awhile, plan accordingly.

---

## How Matching Works

Each ADVE scene is matched to a Stash scene using these strategies in order:

1. **Performer + duration (primary)** — all performers listed on ADVE must be
   present in the Stash scene, AND the duration must be within tolerance
   (120 sec base + 10 sec per performer, to account for ADVE's rounded
   whole-minute durations).
2. **Performer match alone** — used when ADVE has no duration listed.
3. **Duration match alone** — used when ADVE has no performers listed.
4. **Title match (fallback)** — normalized exact title comparison. Generic
   titles like "Scene 1" are skipped to avoid false positives.

---

## Data Persistence & Caching

- Results are written to `results/group_<id>.json` after every run and persist
  across page navigations and Stash restarts. The **🎬 Scene Checker** button
  shows a completion badge (e.g. `2 / 4`) without needing to re-run.
- ADVE pages are cached in `.cache/` for **24 hours**.
- Click **Re-check** to force a fresh scrape and overwrite stored results.

---

## File Structure

```
Stash_Group_ADVE_Movie_Plugin/
├── Stash_Group_ADVE_Movie_Plugin.yml   ← Plugin manifest
├── checker.py                          ← Backend: scraper + GraphQL + matching
├── config.json                         ← Your settings (URL, API key, cookie)
├── requirements.txt                    ← Python dependencies
├── panel.js                            ← Frontend UI injected into Group pages
├── results/                            ← Auto-created; persisted result JSON files
└── .cache/                             ← Auto-created; cached ADVE HTML (24 hr TTL)
```

---

## ⚠️ Scraper Fragility Note

The plugin scrapes AdultDVDEmpire's HTML. If ADVE changes their page markup,
the selectors in `checker.py → scrape_adve()` may need updating. The key
pattern to check is the scene anchor:

```python
soup.find_all("a", attrs={"name": re.compile(r"^scene_\d+$")})
```
