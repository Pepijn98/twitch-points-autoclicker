// ==UserScript==
// @name            Twitch.tv Channel Points Auto-clicker
// @namespace       twitch-points-autoclicker
// @version         1.0.4
// @description     Auto-click the green channel point button for you
// @author          Pepijn98
// @match           https://www.twitch.tv/*
// @exclude         https://www.twitch.tv/videos/*
// @exclude         https://www.twitch.tv/*/clip/*
// @exclude         https://clips.twitch.tv/*
// @exclude         https://www.twitch.tv/directory
// @exclude         https://www.twitch.tv/directory/*
// @grant           none

// @homepageURL https://github.com/Pepijn98/twitch-points-autoclicker
// @supportURL https://github.com/Pepijn98/twitch-points-autoclicker/issues
// @updateURL https://raw.githubusercontent.com/Pepijn98/twitch-points-autoclicker/master/index.meta.js
// @downloadURL https://raw.githubusercontent.com/Pepijn98/twitch-points-autoclicker/master/index.user.js

// @run-at document-end
// ==/UserScript==

(() => {
    // Check every 5 seconds if we can collect our points
    setInterval(() => {
        // Get all divs that are a direct child of community-points-summary
        const divs = document.querySelectorAll(".community-points-summary > div");
        // If there are exactly 2 divs that are a direct child of community-points-summary it means the green button is available and we can collect our points
        if (divs.length === 2) {
            // Get the div that has the button in it
            const div = divs[1];
            // There should only be 1 button in this div so we can safely use [0] to get the first element
            const btn = div.getElementsByTagName("button")[0];
            // Emulate a click that collects our points :)
            if (btn) btn.click();
        }
    }, 5000);
})();
