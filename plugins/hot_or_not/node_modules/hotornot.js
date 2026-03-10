(async () => {
    try {
        // Prevent double loading
        if (window.hotOrNotLoaded) return;
        window.hotOrNotLoaded = true;

        // In Stash, plugins are served from this base path
        const folderPath = '/plugin/hot_or_not/javascript';

        // Dynamic imports using the absolute Stash plugin path
        // We add a cache-buster (?v=...) to ensure you see your latest changes
        const version = Date.now(); 
        
        const { main } = await import(`${folderPath}/main.js?v=${version}`);
        const { addFloatingButton } = await import(`${folderPath}/ui-manager.js?v=${version}`);

        // Expose to window for Stash UI hooks
        window.hotOrNot = { main, addFloatingButton };

        // Initialize
        if (typeof main === 'function') {
            main();
        } else {
            // If main.js just runs code globally, it's already executed by the import
            console.log("[HotOrNot] Module loaded");
        }

    } catch (err) {
        console.error("HotOrNot failed to load dependencies:", err);
    }
})();
