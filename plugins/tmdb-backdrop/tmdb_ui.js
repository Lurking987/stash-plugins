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
        if (!apiKey) return console.error("TMDB Plugin: No API Key found in settings.");

        const idMatch = tmdbUrl.match(/(movie|tv|collection)\/(\d+)/);
        if (!idMatch) return;
        const [_, type, tmdbId] = idMatch;

        try {
            const response = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/images?api_key=${apiKey}`);
            const data = await response.json();
            
            if (data.backdrops && data.backdrops.length > 0) {
                const randomIdx = Math.floor(Math.random() * data.backdrops.length);
                const filePath = data.backdrops[randomIdx].file_path;
                const imageUrl = `https://image.tmdb.org/t/p/original${filePath}`;
                
                let styleBlock = document.getElementById('tmdb-dynamic-style');
                if (!styleBlock) {
                    styleBlock = document.createElement('style');
                    styleBlock.id = 'tmdb-dynamic-style';
                    document.head.appendChild(styleBlock);
                }

                // Target #group-page for the image and .detail-header for transparency
                styleBlock.innerHTML = `
                    #group-page { 
                        background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${imageUrl}") !important; 
                        background-size: cover !important;
                        background-attachment: fixed !important;
                        background-position: center !important;
                        min-height: 100vh;
                    }
                    #group-page .background-image-container {
                        display: none !important;
                    }
                    /* Clear the header background to reveal the TMDB image */
                    #group-page .detail-header {
                        background-color: transparent !important;
                        border-bottom: none !important; /* Optional: removes the bottom border line */
                    }
					#group-page .filtered-list-toolbar {
						background-color: transparent !important;
					}
					#group-page .card {
						background-color: transparent !important;
						box-shadow: none !important;
					}
					#group-page .detail-body nav {
						border-bottom: solid 0px;
					}
                `;
                console.log("TMDB Plugin: Backdrop applied:", imageUrl);
            }
        } catch (e) { console.error("TMDB Plugin API Error:", e); }
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
