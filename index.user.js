// ==UserScript==
// @name            Twitch.tv Channel Points Auto-clicker
// @namespace       twitch-points-autoclicker
// @version         1.2.1
// @description     Auto-click the green channel point button for you
// @author          Pepijn98
// @match           https://www.twitch.tv/*
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

    var self = this;

    /**
     * Start the interval
     *
     * @param {(...args: any[]) => void} fn The function with all the stuff that needs to be done every interval
     * @param {number} duration The duration in milliseconds in which each interval happens
     * @param {boolean} initial Whether to imediatlly execute fn or wait the duration before executing fn for the first time
     */
    self.run = function(fn, duration, initial) {
        if (!initial) initial = false;

        if (self.baseline === undefined) {
            self.baseline = new Date().getTime();
        }

        if ((initial && self.first) || !self.first) fn();
        if (self.first) self.first = false;

        var end = new Date().getTime();
        self.baseline += duration;

        var nextTick = duration - (end - self.baseline);
        if (nextTick < 0) {
            nextTick = 0;
        }

        self.timer = setTimeout(function() {
            self.run(fn, duration)
        }, nextTick);
        self.active = true;
    };

    /**
     * Stop the currently running interval if there is one
     */
    self.stop = function() {
        if (self.timer) {
            clearTimeout(self.timer);
            self.timer = undefined;
            self.active = false;
        }
    }
};

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
