// ==UserScript==
// @name            Twitch.tv Channel Points Auto-clicker
// @namespace       twitch-points-autoclicker
// @version         1.2.0
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

/**
 * Create a more accurate setInterval
 */
function Interval() {
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
Interval.prototype.run = function(fn, duration, initial) {
    if (!initial) initial = false;

    if (this.baseline === undefined) {
        this.baseline = new Date().getTime();
    }

    if ((initial && this.first) || !this.first) fn();
    if (this.first) this.first = false;

    var end = new Date().getTime();
    this.baseline += duration;

    var nextTick = duration - (end - this.baseline);
    if (nextTick < 0) {
        nextTick = 0;
    }

    this.timer = setTimeout(function() {
        this.run(fn, duration)
    }, nextTick);
    this.active = true;
}

/**
 * Stop the currently running interval if there is one
 */
Interval.prototype.stop = function() {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
        this.active = false;
    }
}

(function() {
    var interval = new Interval();

    // Check every 5 seconds if we can collect our points
    interval.run(function() {
        // Get all divs that are a direct child of community-points-summary
        var divs = document.querySelectorAll(".community-points-summary > div");
        // Get the div that has the button in it
        var div = divs[1];
        // Make sure it isn't undefined
        if (div) {
            // There should only be 1 button in this div so we can safely use [0] to get the first element
            var btn = div.getElementsByTagName("button")[0];
            // Check if button is available
            if (btn) {
                // Emulate a click that collects our points :)
                btn.click();
            }
        }
    }, 5000);
})();
