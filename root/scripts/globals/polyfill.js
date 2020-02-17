/**Contains implementation for features that vary between browsers*/
const POLYFILL =
{
    /**
     * Calls a function when the browser is ready to draw its next frame
     * @param {Function} callback The function to call
     */
    CALL_ON_NEXT_DRAW_CYCLE: function(callback){},
    /**Gets the most precise time available*/
    NOW: function(){ return 0.0; }
};

(function()
{
    // Rendering is implemented using different methods in browsers.
    // Ensure a valid method is routed to by checking whether it exists.
    if (window.requestAnimationFrame)
        POLYFILL.CALL_ON_NEXT_DRAW_CYCLE = function(callback)
        { window.requestAnimationFrame(callback) };
    else if (window.webkitRequestAnimationFrame)
        POLYFILL.CALL_ON_NEXT_DRAW_CYCLE = function(callback)
        { window.webkitRequestAnimationFrame(callback) };
    else if (window.mozRequestAnimationFrame)
        POLYFILL.CALL_ON_NEXT_DRAW_CYCLE = function(callback)
        { window.mozRequestAnimationFrame(callback) };
    else if (window.oRequestAnimationFrame)
        POLYFILL.CALL_ON_NEXT_DRAW_CYCLE = function(callback)
        { window.oRequestAnimationFrame(callback) };
    else
    {
        // If no frame method exists, fallback onto timeout at 50 hertz.
        POLYFILL.CALL_ON_NEXT_DRAW_CYCLE = function(callback)
        { setTimeout(callback, 20); }
    }

    // Older browser versions may not implement performance now.
    if (window.performance.now)
    {
        POLYFILL.NOW = function()
        { return window.performance.now() / 1000; }
    }
    else
    {
        // In that case the less accurate date now must be used.
        POLYFILL.NOW = function()
        { return Date.now() / 1000; }
    }
})();

Object.freeze(POLYFILL);