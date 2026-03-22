/**
 * panel.js — Movie Scene Checker
 *
 * Architecture:
 *   Browser JS  →  RunPluginTask mutation  →  checker.py (Python, server-side)
 *                                                  ↓ scrapes ADVE with age-gate cookie
 *                                                  ↓ writes .results/group_<id>.json
 *   Browser JS  ←  polls GET /plugin/movie-scene-checker/.results/group_<id>.json
 */

(function () {
  "use strict";

  const PLUGIN_ID   = "Stash_Group_ADVE_Movie_Plugin";
  const MOUNT_ID    = "scene-checker-root";
  const GROUP_ROUTE = /^\/(groups|movies)\/(\d+)/;
  const POLL_MS     = 1500;
  const POLL_MAX    = 40;

  // ── Wait for PluginApi ─────────────────────────────────────────────────────

  function waitForPluginApi(cb, timeout = 15000) {
    const start = Date.now();
    const iv = setInterval(() => {
      if (window.PluginApi?.React) {
        clearInterval(iv);
        cb(window.PluginApi);
      } else if (Date.now() - start > timeout) {
        clearInterval(iv);
        console.warn("[SceneChecker] PluginApi never became available.");
      }
    }, 200);
  }

  // ── Stash GraphQL ──────────────────────────────────────────────────────────

  async function callGQL(query, variables) {
    const resp = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!resp.ok) throw new Error(`GraphQL HTTP ${resp.status}`);
    const json = await resp.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  }

  const FIND_GROUP_QUERY = `
    query SceneCheckerFindGroup($id: ID!) {
      findGroup(id: $id) {
        id name urls
        scenes { id title }
      }
    }
  `;

  async function fetchGroup(groupId) {
    const data = await callGQL(FIND_GROUP_QUERY, { id: groupId });
    return data?.findGroup ?? null;
  }

  const RUN_TASK_MUTATION = `
    mutation SceneCheckerRunTask($plugin_id: ID!, $task_name: String!, $args: [PluginArgInput!]) {
      runPluginTask(plugin_id: $plugin_id, task_name: $task_name, args: $args)
    }
  `;

  async function triggerPythonTask(groupId) {
    await callGQL(RUN_TASK_MUTATION, {
      plugin_id: PLUGIN_ID,
      task_name: "Check Group Scenes",
      args: [{ key: "group_id", value: { str: groupId } }],
    });
  }

  function resultUrl(groupId) {
    return `/plugin/${PLUGIN_ID}/assets/results/group_${groupId}.json`;
  }

  async function pollForResult(groupId, onProgress) {
    for (let i = 0; i < POLL_MAX; i++) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      onProgress(i + 1, POLL_MAX);
      try {
        const resp = await fetch(resultUrl(groupId) + "?t=" + Date.now());
        if (resp.ok) {
          const data = await resp.json();
          if (data.group_id === groupId || data.error) return data;
        }
      } catch (_) {}
    }
    throw new Error("Timed out waiting for scene data. Check Stash task logs.");
  }

  const ADVE_RE = /https?:\/\/(?:www\.)?adultdvdempire\.com\/[^\s"'>]+/i;

  function findAdveUrl(urls) {
    for (const url of (urls ?? [])) {
      if (ADVE_RE.test(url.trim())) return url.trim();
    }
    return null;
  }

  // ── React UI ───────────────────────────────────────────────────────────────

  function buildPanel(React) {
    const { useState, useCallback, useEffect } = React;
    const h = React.createElement;

    function SceneCard({ scene }) {
      const { adve, in_library } = scene;
      return h("div", { style: S.card },
        h("div", { style: S.thumbWrap },
          adve.thumbnail
            ? h("img", { src: adve.thumbnail, alt: adve.title, style: S.thumb,
                         loading: "lazy",
                         onError: (e) => { e.target.style.display = "none"; } })
            : h("div", { style: S.noThumb }, "No Image"),
          h("div", { style: in_library ? S.badgeHave : S.badgeMiss },
            in_library ? "✓ In Library" : "✗ Missing")
        ),
        h("div", { style: S.cardBody },
          h("p", { style: S.sceneTitle }, adve.title || `Scene ${adve.index}`),
          adve.duration ? h("span", { style: S.duration }, adve.duration) : null,
          adve.performers?.length
            ? h("p", { style: S.performers }, adve.performers.join(", "))
            : null
        )
      );
    }

    function StatBar({ total, inLib, missing }) {
      const pct = total > 0 ? Math.round((inLib / total) * 100) : 0;
      return h("div", { style: S.statBar },
        h("span", { style: S.statItem }, "📀 ADVE: ", h("strong", null, total)),
        h("span", { style: S.statItem }, "✅ Have: ", h("strong", null, inLib)),
        h("span", { style: S.statItem }, "❌ Missing: ",
          h("strong", { style: { color: "#f87171" } }, missing)),
        h("span", { style: { marginLeft: "auto" } },
          h("span", { style: { ...S.pct, background: pct === 100 ? "#22c55e" : "#3b82f6" } },
            pct + "% complete"))
      );
    }

    function FilterBar({ filter, setFilter, total, missing }) {
      const btn = (label, val) =>
        h("button", { style: filter === val ? S.fOn : S.fOff, onClick: () => setFilter(val) }, label);
      return h("div", { style: S.filterBar },
        btn(`All (${total})`, "all"),
        btn(`Missing (${missing})`, "missing"),
        btn(`In Library (${total - missing})`, "have")
      );
    }

    function Panel({ groupId }) {
      const [open, setOpen]             = useState(false);
      const [status, setStatus]         = useState("idle");
      const [scenes, setScenes]         = useState([]);
      const [movieTitle, setMovieTitle] = useState("");
      const [adveUrl, setAdveUrl]       = useState("");
      const [filter, setFilter]         = useState("all");
      const [err, setErr]               = useState("");
      const [pollStep, setPollStep]     = useState(0);

      useEffect(() => {
        let cancelled = false;
        fetch(resultUrl(groupId) + "?t=" + Date.now())
          .then((r) => r.ok ? r.json() : null)
          .then((data) => {
            if (cancelled || !data || data.error) return;
            if (data.group_id === groupId && data.scenes) {
              setMovieTitle(data.movie_title || "");
              setAdveUrl(data.adve_url || "");
              setScenes(data.scenes || []);
              setStatus("done");
            }
          })
          .catch(() => {});
        return () => { cancelled = true; };
      }, [groupId]);

      const run = useCallback(async () => {
        setStatus("loading");
        setScenes([]);
        setMovieTitle("");
        setAdveUrl("");
        setErr("");
        setPollStep(0);
        try {
          const group = await fetchGroup(groupId);
          if (!group) throw new Error("Group not found in Stash.");
          if (!findAdveUrl(group.urls)) { setStatus("no_url"); return; }
          await triggerPythonTask(groupId);
          setStatus("polling");
          const result = await pollForResult(groupId, (step) => setPollStep(step));
          if (result.error === "no_adve_url") {
            setStatus("no_url");
          } else if (result.error) {
            throw new Error(result.error);
          } else {
            setMovieTitle(result.movie_title || "");
            setAdveUrl(result.adve_url || "");
            setScenes(result.scenes || []);
            setStatus("done");
          }
        } catch (e) {
          setErr(e.message ?? "Unknown error");
          setStatus("error");
        }
      }, [groupId]);

      const visible = scenes.filter((s) =>
        filter === "missing" ? !s.in_library : filter === "have" ? s.in_library : true
      );
      const missing = scenes.filter((s) => !s.in_library).length;
      const pollPct = Math.round((pollStep / POLL_MAX) * 100);
      const busy    = status === "loading" || status === "polling";

      if (!open) {
        return h("div", { style: S.collapsed },
          h("button", { style: S.toggleBtn, onClick: () => setOpen(true) },
            "🎬 Scene Checker",
            scenes.length > 0 && h("span", { style: S.toggleBadge },
              (scenes.length - missing) + " / " + scenes.length
            )
          )
        );
      }

      return h("div", { style: S.panel },
        h("div", { style: S.header },
          h("div", null,
            h("h4", { style: S.title }, "🎬 Scene Checker"),
            movieTitle && h("p", { style: S.subtitle },
              adveUrl
                ? h("a", { href: adveUrl, target: "_blank", rel: "noreferrer", style: S.subtitleLink }, movieTitle)
                : movieTitle
            )
          ),
          h("div", { style: { display:"flex", gap:"0.5rem", alignItems:"center", flexShrink:0 } },
            h("button", {
              style: busy ? S.btnOff : S.btn,
              onClick: run,
              disabled: busy,
            }, status === "loading" ? "Starting…"
             : status === "polling" ? "Scraping…"
             : status === "done"    ? "Re-check"
             : "Check Scenes"),
            h("button", { style: S.collapseBtn, onClick: () => setOpen(false),
                           title: "Hide Scene Checker" }, "✕")
          )
        ),
        status === "idle" &&
          h("p", { style: S.hint },
            "Click Check Scenes to compare this Group against AdultDVDEmpire."),
        status === "no_url" &&
          h("div", { style: S.warnBox },
            h("span", { style: { fontSize: "1.4rem" } }, "⚠️"),
            h("div", null,
              h("strong", null, "AdultDVDEmpire URL required"),
              h("p", { style: { margin: "4px 0 0", opacity: 0.8, fontSize: "0.85rem" } },
                "Add the ADVE movie page URL to this Group's URL list, then click Check Scenes.")
            )
          ),
        status === "error" &&
          h("div", { style: S.errBox }, "❌ ", err),
        busy &&
          h("div", { style: S.loadBox },
            h("div", { style: S.spinner }),
            h("div", null,
              status === "loading"
                ? "Triggering scrape task…"
                : `Scraping AdultDVDEmpire… (${pollStep}/${POLL_MAX})`,
              status === "polling" &&
                h("div", { style: S.progressBar },
                  h("div", { style: { ...S.progressFill, width: pollPct + "%" } })
                )
            )
          ),
        status === "done" &&
          h(React.Fragment, null,
            h(StatBar, { total: scenes.length, inLib: scenes.length - missing, missing }),
            h(FilterBar, { filter, setFilter, total: scenes.length, missing }),
            visible.length === 0
              ? h("p", { style: { ...S.hint, textAlign: "center" } }, "No scenes match this filter.")
              : h("div", { style: S.grid },
                  visible.map((s) => h(SceneCard, { key: s.adve.index, scene: s }))
                ),
            h("p", { style: S.cacheNote },
              "Results cached 24 hrs server-side. Click Re-check to force a refresh.")
          )
      );
    }

    return Panel;
  }

  // ── Styles ─────────────────────────────────────────────────────────────────

  const S = {
    collapsed:   { margin:"1rem 0 0" },
    toggleBtn:   { background:"#1a1d2e", border:"1px solid #2e3150", borderRadius:"8px",
                   color:"#e2e8f0", padding:"0.45rem 1rem", cursor:"pointer",
                   fontWeight:600, fontSize:"0.85rem", display:"inline-flex",
                   alignItems:"center", gap:"0.5rem", fontFamily:"system-ui,sans-serif" },
    toggleBadge: { background:"#2e3150", borderRadius:"10px", padding:"0.1rem 0.55rem",
                   fontSize:"0.75rem", color:"#a5b4fc", fontWeight:700 },
    collapseBtn: { background:"transparent", border:"1px solid #2e3150", borderRadius:"6px",
                   color:"#94a3b8", width:"28px", height:"28px", cursor:"pointer",
                   display:"flex", alignItems:"center", justifyContent:"center",
                   fontSize:"0.75rem", padding:0 },
    panel:       { background:"#1a1d2e", border:"1px solid #2e3150", borderRadius:"10px",
                   padding:"1.25rem", margin:"1rem 0 0", color:"#e2e8f0",
                   fontFamily:"system-ui,sans-serif", width:"100%", boxSizing:"border-box" },
    header:      { display:"flex", alignItems:"flex-start", justifyContent:"space-between",
                   marginBottom:"1rem" },
    title:       { margin:0, fontSize:"1.05rem", fontWeight:700 },
    subtitle:    { margin:"3px 0 0", fontSize:"0.8rem", opacity:0.5 },
    subtitleLink:{ color:"inherit", textDecoration:"underline", textDecorationStyle:"dotted", opacity:0.7 },
    btn:         { background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none",
                   borderRadius:"6px", padding:"0.4rem 1rem", cursor:"pointer",
                   fontWeight:600, fontSize:"0.85rem", flexShrink:0 },
    btnOff:      { background:"#374151", color:"#9ca3af", border:"none", borderRadius:"6px",
                   padding:"0.4rem 1rem", cursor:"not-allowed",
                   fontWeight:600, fontSize:"0.85rem", flexShrink:0 },
    hint:        { opacity:0.45, fontSize:"0.875rem", margin:"0.5rem 0" },
    warnBox:     { display:"flex", gap:"0.875rem", alignItems:"flex-start", background:"#451a03",
                   border:"1px solid #92400e", borderRadius:"8px",
                   padding:"1rem", marginBottom:"0.5rem" },
    errBox:      { background:"#3b0a0a", border:"1px solid #7f1d1d", borderRadius:"8px",
                   padding:"0.875rem", color:"#fca5a5", fontSize:"0.875rem" },
    loadBox:     { display:"flex", alignItems:"flex-start", gap:"0.75rem",
                   padding:"1.25rem 0", opacity:0.75, fontSize:"0.875rem" },
    spinner:     { width:"18px", height:"18px", border:"2px solid #6366f1",
                   borderTopColor:"transparent", borderRadius:"50%",
                   animation:"sc-spin 0.75s linear infinite", flexShrink:0, marginTop:"2px" },
    progressBar: { height:"4px", background:"#1e2235", borderRadius:"2px",
                   marginTop:"8px", width:"200px", overflow:"hidden" },
    progressFill:{ height:"100%", background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
                   borderRadius:"2px", transition:"width 0.4s ease" },
    statBar:     { display:"flex", gap:"1.25rem", alignItems:"center", background:"#0f1020",
                   borderRadius:"8px", padding:"0.65rem 1rem",
                   marginBottom:"0.875rem", flexWrap:"wrap" },
    statItem:    { fontSize:"0.85rem" },
    pct:         { borderRadius:"20px", padding:"0.15rem 0.7rem",
                   fontSize:"0.78rem", color:"#fff", fontWeight:700 },
    filterBar:   { display:"flex", gap:"0.5rem", marginBottom:"0.875rem" },
    fOff:        { background:"#1e2235", border:"1px solid #2e3150", color:"#94a3b8",
                   borderRadius:"20px", padding:"0.25rem 0.85rem",
                   cursor:"pointer", fontSize:"0.78rem" },
    fOn:         { background:"#4f46e5", border:"1px solid #6366f1", color:"#fff",
                   borderRadius:"20px", padding:"0.25rem 0.85rem",
                   cursor:"pointer", fontSize:"0.78rem", fontWeight:600 },
    grid:        { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",
                   gap:"0.875rem" },
    card:        { background:"#0f1020", border:"1px solid #1e2235",
                   borderRadius:"8px", overflow:"hidden" },
    thumbWrap:   { position:"relative", aspectRatio:"16/9",
                   background:"#1a1d2e", overflow:"hidden" },
    thumb:       { width:"100%", height:"100%", objectFit:"cover", display:"block" },
    noThumb:     { width:"100%", height:"100%", display:"flex", alignItems:"center",
                   justifyContent:"center", fontSize:"0.7rem", opacity:0.25 },
    badgeHave:   { position:"absolute", top:"5px", right:"5px",
                   background:"rgba(34,197,94,0.92)", color:"#fff",
                   borderRadius:"4px", padding:"2px 6px", fontSize:"0.68rem", fontWeight:700 },
    badgeMiss:   { position:"absolute", top:"5px", right:"5px",
                   background:"rgba(239,68,68,0.92)", color:"#fff",
                   borderRadius:"4px", padding:"2px 6px", fontSize:"0.68rem", fontWeight:700 },
    cardBody:    { padding:"0.55rem 0.7rem" },
    sceneTitle:  { margin:"0 0 3px", fontSize:"0.78rem", fontWeight:600, lineHeight:1.3,
                   whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
    duration:    { fontSize:"0.7rem", color:"#94a3b8", background:"#1e2235",
                   borderRadius:"3px", padding:"1px 5px" },
    performers:  { margin:"4px 0 0", fontSize:"0.7rem", color:"#64748b",
                   whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
    cacheNote:   { marginTop:"0.875rem", fontSize:"0.7rem", opacity:0.3, textAlign:"right" },
  };

  if (!document.getElementById("sc-keyframes")) {
    const s = document.createElement("style");
    s.id = "sc-keyframes";
    s.textContent = "@keyframes sc-spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(s);
  }

  // ── Mount / unmount ────────────────────────────────────────────────────────

  function getGroupId() {
    const m = window.location.pathname.match(GROUP_ROUTE);
    return m ? m[2] : null;
  }

  let _mountedId    = null;
  let _root         = null;
  let _initObserver = null; // one-shot: waits for DOM to be ready on navigation
  let _editObserver = null; // persistent: watches for edit mode toggling
  let _retryTimer   = null;

  // Edit mode: .details-edit gains col-xl-9 when the form is open
  function isEditMode() {
    const anchor = document.querySelector(".details-edit");
    return !!(anchor && anchor.classList.contains("col-xl-9"));
  }

  function doMount(React, ReactDOM, groupId) {
    if (!getGroupId()) return false;
    if (isEditMode()) return false;

    const anchor = document.querySelector(".details-edit");
    if (!anchor) return false;

    const existing = document.getElementById(MOUNT_ID);

    // Already mounted in the right place — nothing to do
    if (existing && _mountedId === groupId && anchor.nextElementSibling === existing) {
      return true;
    }

    // Needs remounting (wrong position, wrong group, or missing)
    if (existing) {
      if (_root?.unmount) _root.unmount();
      existing.remove();
      _root = null;
    }

    const el = document.createElement("div");
    el.id = MOUNT_ID;
    anchor.insertAdjacentElement("afterend", el);

    const Panel = buildPanel(React);
    if (ReactDOM.createRoot) {
      _root = ReactDOM.createRoot(el);
      _root.render(React.createElement(Panel, { groupId }));
    } else {
      ReactDOM.render(React.createElement(Panel, { groupId }), el);
    }
    _mountedId = groupId;
    console.log(`[SceneChecker] Mounted for group ${groupId}`);
    return true;
  }

  // Persistent observer — runs for the lifetime of the page session.
  // Watches for edit mode opening/closing (class change on .details-edit)
  // and remounts the panel whenever view mode is restored.
  function ensureEditObserver(React, ReactDOM) {
    if (_editObserver) return;
    _editObserver = new MutationObserver(() => {
      const groupId = getGroupId();
      if (!groupId) return;
      if (isEditMode()) return; // form still open — keep waiting

      const anchor  = document.querySelector(".details-edit");
      const existing = document.getElementById(MOUNT_ID);

      // Remount if panel is missing or no longer sits right after the anchor
      if (!existing || (anchor && anchor.nextElementSibling !== existing)) {
        doMount(React, ReactDOM, groupId);
      }
    });
    _editObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  function unmountPanel() {
    if (_initObserver) { _initObserver.disconnect(); _initObserver = null; }
    if (_retryTimer)   { clearTimeout(_retryTimer);  _retryTimer = null; }
    // Note: _editObserver stays alive — it handles edit mode for the session
    const el = document.getElementById(MOUNT_ID);
    if (el) {
      if (_root?.unmount) _root.unmount();
      el.remove();
    }
    _root      = null;
    _mountedId = null;
  }

  function mountPanel(React, ReactDOM) {
    // Cancel any in-flight one-shot observer from a previous navigation
    if (_initObserver) { _initObserver.disconnect(); _initObserver = null; }
    if (_retryTimer)   { clearTimeout(_retryTimer);  _retryTimer = null; }

    // Make sure the persistent edit-mode watcher is running
    ensureEditObserver(React, ReactDOM);

    const groupId = getGroupId();
    if (!groupId) {
      unmountPanel();
      return;
    }

    // Try mounting immediately (works if DOM is already ready)
    if (doMount(React, ReactDOM, groupId)) return;

    // Otherwise wait for .details-edit to appear in view mode
    _initObserver = new MutationObserver(() => {
      if (!document.querySelector(".details-edit") || isEditMode()) return;
      _initObserver.disconnect();
      _initObserver = null;
      if (_retryTimer) { clearTimeout(_retryTimer); _retryTimer = null; }
      doMount(React, ReactDOM, groupId);
    });
    _initObserver.observe(document.body, { childList: true, subtree: true });

    _retryTimer = setTimeout(() => {
      if (_initObserver) { _initObserver.disconnect(); _initObserver = null; }
      _retryTimer = null;
      console.warn("[SceneChecker] Timed out waiting for .details-edit.");
    }, 10000);
  }

  // ── Boot ───────────────────────────────────────────────────────────────────

  waitForPluginApi((PluginApi) => {
    const { React, ReactDOM, Event } = PluginApi;
    if (!React || !ReactDOM) {
      console.error("[SceneChecker] Missing React or ReactDOM.");
      return;
    }
    mountPanel(React, ReactDOM);
    Event.addEventListener("stash:location", () => mountPanel(React, ReactDOM));
    console.log("[SceneChecker] Booted.");
  });

})();
