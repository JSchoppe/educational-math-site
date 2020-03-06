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
     * Calls a function everytime the viewport is scrolled
     * @param {Function} callback Takes in no arguments
     */
    CALL_ON_PAGE_SCROLL: function(callback){},
    /**
     * Removes a function from the call every time the viewport is scrolled
     * @param {Function} callback The function to stop calling
     */
    STOP_CALLING_ON_PAGE_SCROLL: function(callback){},
    /**
     * Calls a function every time the bound element enters the view
     * @param {HTMLElement} element The element to check if on screen
     * @param {Function} callback The function to call when the element enters view
     */
    CALL_ON_ELEMENT_SCROLL_IN: function(element, callback){},
    /**
     * Stops calling a function when an element enters the view
     * @param {HTMLElement} element the element to unbind
     */
    STOP_CALLING_ON_ELEMENT_SCROLL_IN: function(element){},
    /**
     * Calls a function every time the bound element exits the view
     * @param {HTMLElement} element 
     * @param {Function} callback 
     */
    CALL_ON_ELEMENT_SCROLL_OUT: function(element, callback){},
    /**
     * Converts an interpolant to an ease curve
     * @param {Number} interpolant The interpolant to smoothen
     */
    EASE_INTERPOLANT: function(interpolant){ return 0; }
};
//#endregion
//#region Implementation
(function()
{
    // Core private variables.
    let lastUpdateTime = POLYFILL.NOW();
    let updateFunctions = [];
    let resizeFunctions = [];
    let scrollFunctions = [];
    let scrollInHandlers = [];
    let scrollOutHandlers = [];

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

    // Define the window scroll action.
    let onScroll = function()
    {
        // Call every function bound to resize.
        for(let i = 0; i < scrollFunctions.length; i++)
            scrollFunctions[i]();

        // Check for a state change in any of the scroll in handlers.
        for(let j = 0; j < scrollInHandlers.length; j++)
        {
            if(isElementOnPage(scrollInHandlers[j].targetElement) !== scrollInHandlers[j].isVisible)
            {
                scrollInHandlers[j].isVisible = !(scrollInHandlers[j].isVisible);
                if(!scrollInHandlers[j].isVisible)
                {
                    scrollInHandlers[j].onTrigger();
                }
            }
        }
    };
    window.addEventListener('scroll', onScroll);

    // Define the scroll into screen mechanism.
    CORE.CALL_ON_ELEMENT_SCROLL_IN = function(element, callback)
    {
        // Add an object that will track this objects visibility state.
        scrollInHandlers.push(
        {
            targetElement: element,
            isVisible: isElementOnPage(element),
            onTrigger: callback
        });
    };
    CORE.STOP_CALLING_ON_ELEMENT_SCROLL_IN = function(element)
    {
        for(let i = 0; i < scrollInHandlers.length; i++)
            if(scrollInHandlers[i].element === element)
                scrollInHandlers.splice(i, 1);
    };

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

    let isElementOnPage = function(element)
    {
        let rect = element.getBoundingClientRect();
        let isVisible = true;
        // Check for any conditions where the objects is completely off the screen.
        if(rect.left < 0 && rect.right < 0){ isVisible = false; }
        if(rect.left > window.innerWidth && rect.right > window.innerWidth){ isVisible = false; }
        if(rect.top < 0 && rect.bottom < 0){ isVisible = false; }
        if(rect.top > window.innerHeight && rect.bottom > window.innerHeight){ isVisible = false; }

        return isVisible;
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
    CORE.CALL_ON_PAGE_SCROLL = function(callback)
    {
        // Do not add the function if it is already in the array.
        for(let i = 0; i < scrollFunctions.length; i++)
            if(scrollFunctions[i] === callback)
                return;
        // Else add the function to the array.
        scrollFunctions.push(callback);
    };
    CORE.STOP_CALLING_ON_PAGE_SCROLL = function(callback)
    {
        // Remove any instances of this function from the array.
        for(let i = 0; i < scrollFunctions.length; i++)
            if(scrollFunctions[i] === callback)
                scrollFunctions.splice(i, 1);
    };
    //#endregion
})();
//#endregion

Object.freeze(CORE);