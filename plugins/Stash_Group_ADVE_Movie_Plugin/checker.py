"""
checker.py — Movie Scene Checker backend

Flow:
  1. JS panel triggers RunPluginTask via Stash GraphQL mutation
  2. Stash calls this script with JSON on stdin containing group_id
  3. Script fetches Group data from Stash GraphQL
  4. Script scrapes ADVE server-side (bypasses CORS / age gate)
  5. Script writes result JSON to a well-known file in the plugin dir
  6. JS panel polls for that result file via a plain GET request
"""

import sys
import json
import os
import re
import time
import hashlib
import requests
from typing import Optional
try:
    from bs4 import BeautifulSoup
except ImportError:
    print(json.dumps({"error": "beautifulsoup4 is not installed. Run: pip install beautifulsoup4 requests"}))
    sys.exit(1)

# ─────────────────────────────────────────────
# LOGGING
# Stash reads log level from a prefix on each stderr line:
#   2TRACE:   2DEBUG:   2INFO:   2WARNING:   2ERROR:   2PROGRESS:nn.n
# ─────────────────────────────────────────────

class log:
    # Stash plugin log protocol (from stash/pkg/plugin/common/log):
    # Each line on stderr: SOH () + level letter + STX () + message
    # Level letters: t=trace, d=debug, i=info, w=warning, e=error, p=progress
    TRACE    = "t"
    DEBUG    = "d"
    INFO     = "i"
    WARNING  = "w"
    ERROR    = "e"
    PROGRESS = "p"

    @staticmethod
    def _emit(level: str, msg: str):
        print(f"{level}{msg}", file=sys.stderr, flush=True)

    @staticmethod
    def trace(msg):   log._emit(log.TRACE,   msg)
    @staticmethod
    def debug(msg):   log._emit(log.DEBUG,   msg)
    @staticmethod
    def info(msg):    log._emit(log.INFO,    msg)
    @staticmethod
    def warning(msg): log._emit(log.WARNING, msg)
    @staticmethod
    def error(msg):   log._emit(log.ERROR,   msg)
    @staticmethod
    def progress(pct: float):
        log._emit(log.PROGRESS, f"{pct:.3f}")


# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────

PLUGIN_DIR  = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR   = os.path.join(PLUGIN_DIR, ".cache")
RESULT_DIR  = os.path.join(PLUGIN_DIR, "results")
CACHE_TTL   = 60 * 60 * 24  # 24 hours

# Log resolved paths to stderr so they appear in Stash task logs
log.debug(f"PLUGIN_DIR={PLUGIN_DIR}")
log.debug(f"RESULT_DIR={RESULT_DIR}")

# Load config.json — all user-configurable values live here.
# Environment variables take precedence so Docker/systemd overrides still work.
_config_path = os.path.join(PLUGIN_DIR, "config.json")
_config: dict = {}
if os.path.exists(_config_path):
    try:
        with open(_config_path) as _f:
            _config = json.load(_f)
    except Exception as _e:
        log.warning(f"Could not read config.json: {_e}")

STASH_URL           = os.getenv("STASH_URL")           or _config.get("stash_url",           "http://localhost:9999")
STASH_API_KEY       = os.getenv("STASH_API_KEY")       or _config.get("stash_api_key",       "")
ADVE_SESSION_COOKIE = os.getenv("ADVE_SESSION_COOKIE") or _config.get("adve_session_cookie", "")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.adultdvdempire.com/",
}

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# STASH GRAPHQL
# ─────────────────────────────────────────────

def stash_gql(query: str, variables: dict = None) -> dict:
    headers = {"Content-Type": "application/json"}
    if STASH_API_KEY:
        headers["ApiKey"] = STASH_API_KEY
    resp = requests.post(
        f"{STASH_URL}/graphql",
        json={"query": query, "variables": variables or {}},
        headers=headers,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("data", {})


def get_group(group_id: str) -> dict:
    query = """
    query FindGroup($id: ID!) {
      findGroup(id: $id) {
        id
        name
        urls
        scenes {
          id
          title
          files { duration }
          performers { name }
        }
      }
    }
    """
    return stash_gql(query, {"id": group_id}).get("findGroup")


def get_all_groups() -> list:
    query = """
    query AllGroups($filter: FindFilterType, $group_filter: GroupFilterType) {
      findGroups(filter: $filter, group_filter: $group_filter) {
        groups { id name urls }
      }
    }
    """
    # per_page: -1 returns all records; group_filter restricts to groups
    # whose URL list contains an adultdvdempire.com URL.
    return stash_gql(query, {
        "filter": {"per_page": -1},
        "group_filter": {
            "url": {
                "value": "adultdvdempire.com",
                "modifier": "INCLUDES",
            }
        },
    }).get("findGroups", {}).get("groups", [])


# ─────────────────────────────────────────────
# URL DETECTION
# ─────────────────────────────────────────────

ADVE_PATTERN = re.compile(
    r"https?://(?:www\.)?adultdvdempire\.com/[\w\-]+/?",
    re.IGNORECASE,
)

def find_adve_url(urls: list) -> Optional[str]:
    for url in (urls or []):
        if ADVE_PATTERN.match(url.strip()):
            return url.strip()
    return None


# ─────────────────────────────────────────────
# CACHING
# ─────────────────────────────────────────────

def _cache_path(url: str) -> str:
    key = hashlib.md5(url.encode()).hexdigest()
    return os.path.join(CACHE_DIR, f"{key}.json")


def cache_load(url: str) -> Optional[dict]:
    path = _cache_path(url)
    if not os.path.exists(path):
        return None
    if time.time() - os.path.getmtime(path) > CACHE_TTL:
        return None
    with open(path) as f:
        return json.load(f)


def cache_save(url: str, data: dict):
    with open(_cache_path(url), "w") as f:
        json.dump(data, f)


# ─────────────────────────────────────────────
# RESULT FILE (polled by JS)
# ─────────────────────────────────────────────

def result_path(group_id: str) -> str:
    return os.path.join(RESULT_DIR, f"group_{group_id}.json")


def write_result(group_id: str, data: dict):
    """Write result JSON where Stash can serve it as a static file."""
    path = result_path(group_id)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f)
    log.info(f"Result written to: {path}")


# ─────────────────────────────────────────────
# ADVE SCRAPER
# ─────────────────────────────────────────────

def scrape_adve(url: str, force: bool = False) -> dict:
    if not force:
        cached = cache_load(url)
        if cached:
            return cached

    if not ADVE_SESSION_COOKIE:
        raise RuntimeError(
            "ADVE_SESSION_COOKIE is not set. "
            "Add your ADVE browser session cookie to the plugin settings."
        )

    session = requests.Session()
    session.headers.update(HEADERS)

    # Inject the full cookie string from a real logged-in browser session
    for cookie_part in ADVE_SESSION_COOKIE.split(";"):
        cookie_part = cookie_part.strip()
        if "=" in cookie_part:
            name, _, value = cookie_part.partition("=")
            session.cookies.set(name.strip(), value.strip(), domain="www.adultdvdempire.com")

    resp = session.get(url, timeout=20, allow_redirects=True)
    resp.raise_for_status()

    # Check if we landed on any verification/gate page
    if any(x in resp.url for x in ["AgeVerification", "AgeConfirmation", "age_verification", "loginpage"]):
        raise RuntimeError(
            f"ADVE redirected to a gate page: {resp.url}. "
            "Your session cookie may be expired. Please update ADVE_SESSION_COOKIE in plugin settings."
        )

    # Save raw HTML for selector debugging
    debug_path = os.path.join(RESULT_DIR, "debug_last_page.html")
    try:
        with open(debug_path, "w", encoding="utf-8") as f:
            f.write(resp.text)
        log.debug(f"Raw HTML saved to: {debug_path}")
    except Exception as e:
        log.warning(f"Could not save debug HTML: {e}")

    soup = BeautifulSoup(resp.text, "html.parser")
    
    log.debug(f"Page title: {soup.title.string if soup.title else None}")
    log.debug(f"Final URL after redirects: {resp.url}")

    # Movie title
    title_tag = soup.select_one("h1")
    movie_title = title_tag.get_text(strip=True) if title_tag else "Unknown"

    # ADVE scene structure:
    # Each scene has an anchor: <a name="scene_XXXXXX" class="anchor">
    # Followed by a .row div containing:
    #   h3 > a[label="Scene Title"]  — scene title
    #   span (sibling of h3 parent col) — duration e.g. "29 min"
    #   a[href*="pornstars"]           — performer name
    #   img[data-bgsrc]                — thumbnail (NOT data-src or src)

    scene_anchors = soup.find_all("a", attrs={"name": re.compile(r"^scene_\d+$")})
    log.info(f"Found {len(scene_anchors)} scene anchors")

    scenes = []
    for idx, anchor in enumerate(scene_anchors, start=1):
        # The scene content lives in the next sibling .row div
        row = anchor.find_next_sibling("div", class_="row")
        if not row:
            continue

        # Title: <a label="Scene Title">
        title_el = row.find("a", attrs={"label": "Scene Title"})
        scene_title = title_el.get_text(strip=True) if title_el else f"Scene {idx}"

        # Duration: <span> sibling of the h3 parent col-sm-6
        duration = ""
        h3 = row.find("h3")
        if h3:
            # span is a sibling of h3 inside the same col div
            dur_span = h3.find_next_sibling("span")
            if dur_span:
                duration = dur_span.get_text(strip=True)

        # Performers: links to pornstar pages in this row
        perf_els = row.find_all("a", href=re.compile(r"/.*-pornstars\.html"))
        performers = [p.get_text(strip=True) for p in perf_els]

        # Thumbnail: first img with data-bgsrc in the screenshot grid
        # (the next .row sibling after the title row)
        thumbnail = ""
        next_row = row.find_next_sibling("div", class_="row")
        if next_row:
            img_el = next_row.find("img", attrs={"data-bgsrc": True})
            if img_el:
                thumbnail = img_el["data-bgsrc"]
                if thumbnail.startswith("//"):
                    thumbnail = "https:" + thumbnail

        scenes.append({
            "index": idx,
            "title": scene_title,
            "thumbnail": thumbnail,
            "performers": performers,
            "duration": duration,
        })

    result = {
        "movie_title": movie_title,
        "total_scenes": len(scenes),
        "scenes": scenes,
    }
    cache_save(url, result)
    return result


# ─────────────────────────────────────────────
# COMPARISON LOGIC
# ─────────────────────────────────────────────

def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", text.lower()).strip()


def performer_set(performers: list) -> set:
    """Return a normalized set of performer names from a list of name strings."""
    return {normalize(p) for p in performers if p}


def parse_duration_secs(dur: str) -> Optional[float]:
    """Parse ADVE duration string to seconds. Handles '29 min' and '29:30'."""
    if not dur:
        return None
    min_match = re.match(r"(\d+)\s*min", dur)
    colon_match = re.match(r"(\d+):(\d+)", dur)
    if min_match:
        return int(min_match.group(1)) * 60
    if colon_match:
        return int(colon_match.group(1)) * 60 + int(colon_match.group(2))
    return None


def match_scene(adve_scene: dict, stash_scenes: list) -> Optional[dict]:
    """
    Match an ADVE scene to a Stash scene.

    Primary strategy: performer overlap AND duration within tolerance.
      - All ADVE performers must be present in the Stash scene.
      - Duration must be within ±90 seconds (ADVE only shows whole minutes).
      - If ADVE has no duration, performer match alone is accepted.
      - If ADVE has no performers, duration match alone is accepted.

    Fallback: exact title match (skips generic titles like Scene 1).
    """
    adve_performers = performer_set(adve_scene.get("performers") or [])
    adve_secs = parse_duration_secs(adve_scene.get("duration", ""))

    for s in stash_scenes:
        stash_performers = performer_set(
            [p.get("name", "") for p in (s.get("performers") or [])]
        )
        stash_secs_list = [
            float(f.get("duration") or 0)
            for f in (s.get("files") or [])
            if f.get("duration")
        ]
        stash_secs = stash_secs_list[0] if stash_secs_list else None

        performers_match = bool(adve_performers) and adve_performers <= stash_performers
        # ADVE durations are rounded whole minutes, so tolerance must cover
        # up to 59 sec of rounding plus any encode-length variance.
        # Scale up slightly for scenes with many performers (longer intros etc).
        tolerance = 120 + (len(adve_performers) * 10)
        duration_match = (
            adve_secs is not None
            and stash_secs is not None
            and abs(stash_secs - adve_secs) <= tolerance
        )

        if adve_performers and adve_secs is not None:
            # Both available: require both to match
            if performers_match and duration_match:
                return s
        elif adve_performers:
            # No duration on ADVE side: performer match alone
            if performers_match:
                return s
        elif adve_secs is not None:
            # No performers on ADVE side: duration match alone
            if duration_match:
                return s

    # Fallback: title match (skip generic "Scene N" titles)
    adve_norm = normalize(adve_scene.get("title") or "")
    if adve_norm and not re.match(r"^scene \d+$", adve_norm):
        for s in stash_scenes:
            if normalize(s.get("title") or "") == adve_norm:
                return s

    return None


def build_comparison(group_id: str) -> dict:
    group = get_group(group_id)
    if not group:
        return {"error": f"Group {group_id} not found in Stash."}

    adve_url = find_adve_url(group.get("urls", []))
    if not adve_url:
        return {
            "error": "no_adve_url",
            "group_name": group["name"],
            "message": (
                "No AdultDVDEmpire URL found in this Group's URL list. "
                "Add the ADVE movie URL to the Group to enable scene checking."
            ),
        }

    try:
        adve_data = scrape_adve(adve_url)
    except Exception as e:
        return {"error": f"Failed to scrape ADVE: {e}"}

    stash_scenes = group.get("scenes", [])
    results = []
    for adve_scene in adve_data["scenes"]:
        matched = match_scene(adve_scene, stash_scenes)
        results.append({
            "adve": adve_scene,
            "stash_scene": {"id": matched["id"], "title": matched["title"]} if matched else None,
            "in_library": matched is not None,
        })

    return {
        "group_id": group_id,
        "group_name": group["name"],
        "adve_url": adve_url,
        "movie_title": adve_data["movie_title"],
        "total_adve_scenes": adve_data["total_scenes"],
        "total_stash_scenes": len(stash_scenes),
        "scenes": results,
    }


# ─────────────────────────────────────────────
# PLUGIN ENTRY POINT
# ─────────────────────────────────────────────

def main():
    try:
        _run()
    except Exception as e:
        import traceback
        print(json.dumps({"error": str(e), "trace": traceback.format_exc()}))
        sys.exit(1)

def _run():
    raw = sys.stdin.read().strip()
    try:
        plugin_input = json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        plugin_input = {}

    if ADVE_SESSION_COOKIE:
        log.info("Session cookie loaded from config.json")
    else:
        log.warning("No session cookie found in config.json or environment")

    args = plugin_input.get("args", {})
    mode = args.get("mode", "check_group")

    if mode == "check_group":
        group_id = args.get("group_id")
        if not group_id:
            result = {"error": "group_id is required"}
        else:
            result = build_comparison(group_id)
            # Write to result file so JS can poll for it
            write_result(group_id, result)
        print(json.dumps(result))

    elif mode == "scrape_all":
        groups = get_all_groups()
        total = len(groups)
        summary = []
        log.info(f"Scraping {total} groups with ADVE URLs...")
        log.progress(0.0)
        start_time = time.time()

        for idx, g in enumerate(groups, start=1):
            if find_adve_url(g.get("urls", [])):
                log.info(f"[{idx}/{total}] {g['name']}")
                result = build_comparison(g["id"])
                write_result(g["id"], result)
                summary.append({
                    "group_id": g["id"],
                    "group_name": g["name"],
                    "status": "error" if "error" in result else "ok",
                    "total_adve": result.get("total_adve_scenes", 0),
                    "total_stash": result.get("total_stash_scenes", 0),
                })

            # Update progress bar and ETA after every group
            elapsed = time.time() - start_time
            pct = idx / total
            eta = int((elapsed / idx) * (total - idx)) if idx > 0 else 0
            log.progress(pct)
            log.info(f"Progress: {idx}/{total} — ETA: {eta}s")

        log.progress(1.0)
        log.info(f"Done. Scraped {len(summary)} groups.")
        print(json.dumps({"scraped": len(summary), "groups": summary}))

    else:
        print(json.dumps({"error": f"Unknown mode: {mode}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()
