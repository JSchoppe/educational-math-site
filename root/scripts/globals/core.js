// Depends on polyfill.js

//#region Public Interface
/**Contains general website functionality*/
const CORE = 
{
    /**Hex strings for common colors*/
    COLOR_PALETTE:
    {
        GRAPH:
        {
            GRID_LINES: "#7F7F7F",
            Y_AXIS: "#46C846",
            X_AXIS: "#C84646"
        }
    },
    /**
     * Calls a function everytime the browsers draws
     * @param {Function} callback Can take in an argument for change in time since last frame
     */
    CALL_ON_UPDATE: function(callback){},
    /**
     * Removes a function from the update call every time the browser draws
     * @param {Function} callback The function to stop calling
     */
    STOP_CALLING_ON_UPDATE: function(callback){},
    /**
     * Calls a function everytime the viewport size changes
     * @param {Function} callback Takes in no arguments
     */
    CALL_ON_RESIZE: function(callback){},
    /**
     * Removes a function from the call every time the viewport changes
     * @param {Function} callback The function to stop calling
     */
    STOP_CALLING_ON_RESIZE: function(callback){},
    /**
     * Converts an interpolant to an ease curve
     * @param {Number} interpolant The interpolant to smoothen
     */
    EASE_INTERPOLANT: function(interpolant){ return 0; }
};
//#endregion

(function()
{
    // Core private variables.
    let updateFunctions = [];
    let lastUpdateTime = POLYFILL.NOW();
    let resizeFunctions = [];

    // Define the update loop.
    let onUpdate = function()
    {
        // Calculate the time that has passed.
        let deltaTime = POLYFILL.NOW() - lastUpdateTime;
        // Call every function bound to update.
        for(let i = 0; i < updateFunctions.length; i++)
            updateFunctions[i](deltaTime);
        // Advance the update cycle.
        lastUpdateTime = POLYFILL.NOW();
        POLYFILL.CALL_ON_NEXT_DRAW_CYCLE(onUpdate);
    };
    // Ignite the update cycle.
    POLYFILL.CALL_ON_NEXT_DRAW_CYCLE(onUpdate);

    // Define the window resize action.
    let onResize = function()
    {
        // Call every function bound to resize.
        for(let i = 0; i < resizeFunctions.length; i++)
            resizeFunctions[i]();
    };
    // Bind to the window's resize event.
    window.addEventListener('resize', onResize);

    // Define the interpolant smoothing function.
    CORE.EASE_INTERPOLANT = function(interpolant)
    {
        if (interpolant < 0) { return 0; }
        if (interpolant < 0.5)
        {
            return 2 * Math.pow(interpolant, 2);
        }
        else if (interpolant < 1)
        {
            return 1 - 2 * Math.pow((interpolant - 1), 2);
        }
        else { return 1; }
    };

    //#region Event Binding
    // Define the process which functions are bound to events.
    CORE.CALL_ON_UPDATE = function(callback)
    {
        // Do not add the function if it is already in the array.
        for(let i = 0; i < updateFunctions.length; i++)
            if(updateFunctions[i] === callback)
                return;
        // Else add the function to the array.
        updateFunctions.push(callback);
    };
    CORE.STOP_CALLING_ON_UPDATE = function(callback)
    {
        // Remove any instances of this function from the array.
        for(let i = 0; i < updateFunctions.length; i++)
            if(updateFunctions[i] === callback)
                updateFunctions.splice(i, 1);
    };
    CORE.CALL_ON_RESIZE = function(callback)
    {
        // Do not add the function if it is already in the array.
        for(let i = 0; i < resizeFunctions.length; i++)
            if(resizeFunctions[i] === callback)
                return;
        // Else add the function to the array.
        resizeFunctions.push(callback);
    };
    CORE.STOP_CALLING_ON_RESIZE = function(callback)
    {
        // Remove any instances of this function from the array.
        for(let i = 0; i < resizeFunctions.length; i++)
            if(resizeFunctions[i] === callback)
                resizeFunctions.splice(i, 1);
    };
    //#endregion
})();

Object.freeze(CORE);