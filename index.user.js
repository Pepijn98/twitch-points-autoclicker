// ==UserScript==
// @name            Twitch.tv Channel Points Auto-clicker
// @namespace       twitch-points-autoclicker
// @version         1.2.1-es6
// @description     Auto-click the green channel point button for you
// @author          Pepijn98
// @match           https://www.twitch.tv/*
// @grant           none

// @homepageURL https://github.com/Pepijn98/twitch-points-autoclicker
// @supportURL https://github.com/Pepijn98/twitch-points-autoclicker/issues
// @updateURL https://raw.githubusercontent.com/Pepijn98/twitch-points-autoclicker/es6/index.meta.js
// @downloadURL https://raw.githubusercontent.com/Pepijn98/twitch-points-autoclicker/es6/index.user.js

// @run-at document-end
// ==/UserScript==

/**
 * Create a more accurate setInterval
 */
class Interval {
    
    constructor() {
        this.active = false;
        this.baseline = undefined;
        this.timer = undefined;
        this.first = true;
    }

    /**
     * Start the interval
     *
     * @param {(...args: any[]) => void} fn The function with all the stuff that needs to be done every interval
     * @param {number} duration The duration in milliseconds in which each interval happens
     * @param {boolean} initial Whether to imediatlly execute fn or wait the duration before executing fn for the first time
     */
    run(fn, duration, initial) {
        if (!initial) initial = false;

        if (this.baseline === undefined) {
            this.baseline = new Date().getTime();
        }

        if ((initial && this.first) || !this.first) fn();
        if (this.first) this.first = false;

        let end = new Date().getTime();
        this.baseline += duration;

        let nextTick = duration - (end - this.baseline);
        if (nextTick < 0) {
            nextTick = 0;
        }

        this.timer = setTimeout(() => {
            this.run(fn, duration)
        }, nextTick);
        this.active = true;
    };

    /**
     * Stop the currently running interval if there is one
     */
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.active = false;
        }
    }
};

(() => {
    let interval = new Interval();

    // Check every 5 seconds if we can collect our points
    interval.run(() => {
        // Get all divs that are a direct child of community-points-summary
        let divs = document.querySelectorAll(".community-points-summary > div");
        // Get the div that has the button in it
        let div = divs[1];
        // Make sure it isn't undefined
        if (div) {
            // There should only be 1 button in this div so we can safely use [0] to get the first element
            let btn = div.getElementsByTagName("button")[0];
            // Check if button is available
            if (btn) {
                // Emulate a click that collects our points :)
                btn.click();
            }
        }
    }, 5000);
})();
