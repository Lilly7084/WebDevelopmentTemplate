"use strict";

function _loadFromManifest(data)
{
    const target = document.getElementsByTagName("head")[0];

    // Identify what files are needed
    console.debug("[bootstrap] Parsing manifest...");
    const cssFiles = [];
    const jsFiles = [];
    for (const [_, fileName] of Object.entries(data)) {
        const extension = fileName.split(".").slice(-1)[0];
        switch (extension) {
            case "css": cssFiles.push(fileName); break;
            case "js": jsFiles.push(fileName); break;
        }
    }

    // Add stylesheets
    for (const file of cssFiles) {
        const e = document.createElement("link");
        e.rel = "stylesheet";
        e.type = "text/css";
        e.href = file;
        target.appendChild(e);
        console.debug("[bootstrap] Included CSS file:", file);
    }

    // Add scripts
    for (const file of jsFiles) {
        const e = document.createElement("script");
        e.type = "text/javascript";
        e.src = file;
        target.appendChild(e);
        console.debug("[bootstrap] Included JS file:", file);
    }
}

var _searching = true;

// Add in an alert for failure to load main()
function _failedToLoad()
{
    alert("Failed to load page: main() did not appear in time.");
    _searching = false;
}

var _failureTimer = setTimeout(_failedToLoad, 5000); // 10s

function _waitForMain()
{
    console.debug(typeof window.main);
    if (typeof window.main === "function") {
        console.debug("[bootstrap] Running main()...");
        clearTimeout(_failureTimer);
        window.main();
    }
    else if (_searching) {
        setTimeout(_waitForMain, 250);
    }
}

// Get and use manifest
fetch("/dist/manifest.json")
    .then(response => response.json())
    .then(_loadFromManifest)
    .then(_waitForMain);
