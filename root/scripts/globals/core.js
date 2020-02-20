// Depends on polyfill.js

/**Contains general website functionality*/
const CORE = 
{
    /**Hex strings for common colors*/
    COLOR_PALETTE:
    {
        
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
    STOP_CALLING_ON_RESIZE: function(callback){}
};

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
    }
    // Bind to the window's resize event.
    window.addEventListener('resize', onResize);

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
})();

Object.freeze(CORE);