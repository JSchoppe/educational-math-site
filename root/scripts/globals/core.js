// Depends on polyfill.js

/**Contains general website functionality*/
const CORE = 
{
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
    /**Hex strings for common colors*/
    COLOR_PALETTE:
    {
        
    }
};

(function()
{
    // Core private variables.
    let updateFunctions = [];
    let lastUpdateTime = POLYFILL.NOW();

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
})();

Object.freeze(CORE);