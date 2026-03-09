(async () => {
    try {
        const scriptPath = document.querySelector('script[src*="hot_or_not.js"]').src;
        const folderPath = scriptPath.substring(0, scriptPath.lastIndexOf('/'));

        // Just import the entry point. It will pull in all its own dependencies.
        const { main } = await import(`${folderPath}/main.js`);
        const { addFloatingButton } = await import(`${folderPath}/ui-manager.js`);

        // Expose only what is needed for the UI/Stash to function
        window.hotOrNot = { main, addFloatingButton };

        // Start the plugin
        main();
        addFloatingButton();
    } catch (err) {
        console.error("HotOrNot failed to load dependencies:", err);
    }
})();
