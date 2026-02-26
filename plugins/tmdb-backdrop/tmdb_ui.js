(function () {
    'use strict';
    let apiKey = null;

    async function waitForElement(selector) {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) { clearInterval(intervalId); resolve(element); }
            }, 100); 
        });
    }

    async function getSettings() {
        try {
            const query = `{ configuration { plugins } }`;
            const res = await fetch('/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
            const result = await res.json();
            const plugins = result.data?.configuration?.plugins || {};
            apiKey = plugins['tmdb-backdrop']?.tmdbapikey || plugins['tmdb-backdrop']?.TmdbApiKey;
        } catch (e) { console.error("TMDB Plugin: Settings failed", e); }
    }

    const updateBackdrop = async (tmdbUrl) => {
        if (!apiKey) await getSettings();
        if (!apiKey) return;

        const idMatch = tmdbUrl.match(/(movie|tv|collection)\/(\d+)/);
        if (!idMatch) return;
        const [_, type, tmdbId] = idMatch;

        try {
            const response = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/images?api_key=${apiKey}`);
            const data = await response.json();
            
            if (data.backdrops?.length > 0) {
                const imageUrl = `https://image.tmdb.org/t/p/original${data.backdrops[Math.floor(Math.random() * data.backdrops.length)].file_path}`;
                
				// 1. Get or Create the style block
                let styleBlock = document.getElementById('tmdb-dynamic-style');
                if (!styleBlock) {
                    styleBlock = document.createElement('style');
                    styleBlock.id = 'tmdb-dynamic-style';
                    document.head.appendChild(styleBlock);
                }

                // 2. Start Fade Out: Only the background layer
                const styleBase = `
                    #group-page { position: relative; min-height: 100vh; background: transparent !important; }
                    #group-page::before {
                        content: "";
                        position: fixed;
                        top: 0; left: 0; width: 100%; height: 100%;
                        z-index: -1;
                        background-size: cover;
                        background-attachment: fixed;
                        background-position: center;
                        transition: opacity 0.8s ease-in-out;
                    }
                `;
                
                // Set opacity to 0 on the existing background layer
                const currentStyle = styleBlock.innerHTML;
                styleBlock.innerHTML = styleBase + currentStyle + `#group-page::before { opacity: 0 !important; }`;

                // 3. Preload and Wait for fade out
                await Promise.all([
                    new Promise(resolve => setTimeout(resolve, 800)),
                    new Promise(resolve => { const img = new Image(); img.src = imageUrl; img.onload = resolve; })
                ]);

                // 4. Update image and Fade In
                styleBlock.innerHTML = `
                    ${styleBase}
                    #group-page::before { 
                        background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${imageUrl}");
                        opacity: 1 !important;
                    }
                    #group-page .background-image-container { display: none !important; }
                    #group-page .detail-header, #group-page .filtered-list-toolbar, #group-page .card {
                        background-color: transparent !important;
                        box-shadow: none !important;
                    }
                    #group-page .detail-body nav { border-bottom: none !important; }
                `;
            }
        } catch (e) { console.error("TMDB Plugin Error:", e); }
    };


    async function updateDOM() {
        const match = window.location.pathname.match(/\/groups\/(\d+)/);
        if (!match) return;

        const id = match[1];
        // Wait for the specific ID shown in your HTML snippet
        await waitForElement('#group-page');

        const gRes = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                query: `query FindGroup($id: ID!) { findGroup(id: $id) { urls } }`, 
                variables: { id: id } 
            })
        });
        const gData = await gRes.json();
        const urls = gData.data?.findGroup?.urls || [];
        const tmdbUrl = urls.find(u => u.toLowerCase().includes('themoviedb.org'));

        if (tmdbUrl) {
            updateBackdrop(tmdbUrl);
        } else {
            const styleBlock = document.getElementById('tmdb-dynamic-style');
            if (styleBlock) styleBlock.remove();
        }
    }

    const handlePathChange = () => {
        if (window.location.pathname.match(/\/groups\/\d+/)) {
            updateDOM();
        }
    };

    // MutationObserver to catch Stash's internal navigation
    const observeUrlChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector("body");
        const observer = new MutationObserver(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                handlePathChange();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    handlePathChange();
    observeUrlChange();
})();
