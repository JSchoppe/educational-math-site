// Depends on polyfill.js

//#region Public Interface
/**Contains general website functionality*/
const CORE = 
{
    /**Hex strings for universal colors*/
    COLOR_PALETTE:
    {
        /**Colors related to the graph*/
        GRAPH:
        {
            /**The color of the normal grid lines*/
            GRID_LINES: "",
            /**The color of the vertical Y axis*/
            Y_AXIS: "",
            /**The color of the horizontal X axis*/
            X_AXIS: "",
            /**The color of nodes*/
            NODE: ""
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
     * @param {String} [axis] Pass "x" or "y" to only check scroll in one one axis
     */
    CALL_ON_ELEMENT_SCROLL_IN: function(element, callback, axis){},
    /**
     * Stops calling a function when an element enters the view
     * @param {HTMLElement} element the element to unbind
     */
    STOP_CALLING_ON_ELEMENT_SCROLL_IN: function(element){},
    /**
     * Calls a function every time the bound element exits the view
     * @param {HTMLElement} element The element to check if on screen
     * @param {Function} callback The function to call when the element exits view
     * @param {String} [axis] Pass "x" or "y" to only check scroll in one one axis
     */
    CALL_ON_ELEMENT_SCROLL_OUT: function(element, callback, axis){},
    /**
     * Stops calling a function when an elements exits the view
     * @param {HTMLElement} element the element to unbind
     */
    STOP_CALLING_ON_ELEMENT_SCROLL_OUT: function(element){},
    /**
     * Converts an interpolant to an ease-in-out curve
     * @param {Number} interpolant The interpolant to adjust
     */
    EASE_INTERPOLANT: function(interpolant){ return 0; },
    /**Call this when a layout change rescales elements that need to change on resize*/
    CALL_RESIZE: function(){}
};
//#endregion
//#region Implementation
(function()
{
    //#region Core Private Variables
    let lastUpdateTime = POLYFILL.NOW();
    let updateFunctions = [];
    let resizeFunctions = [];
    let scrollFunctions = [];
    let scrollInHandlers = [];
    let scrollOutHandlers = [];
    //#endregion
    //#region Core Private Functions
    // Checks if an element is at least partially on the page.
    const isElementOnPageX = function(element)
    {
        const rect = element.getBoundingClientRect();

        // Check for any conditions where the object is completely off the screen.
        let isVisible = true;
        if(rect.left < 0 && rect.right < 0)
            isVisible = false;
        else if(rect.left > window.innerWidth && rect.right > window.innerWidth)
            isVisible = false;

        return isVisible;
    };
    const isElementOnPageY = function(element)
    {
        const rect = element.getBoundingClientRect();

        // Check for any conditions where the object is completely off the screen.
        let isVisible = true;
        if(rect.top < 0 && rect.bottom < 0)
            isVisible = false;
        else if(rect.top > window.innerHeight && rect.bottom > window.innerHeight)
            isVisible = false;

        return isVisible;
    };
    // Define the update loop that is called every drawn frame.
    const onUpdate = function()
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
    // Define the window resize action.
    const onResize = function()
    {
        // Call every function bound to resize.
        for(let i = 0; i < resizeFunctions.length; i++)
            resizeFunctions[i]();
    };
    // Define the window scroll action.
    const onScroll = function()
    {
        // Call every function bound to resize.
        for(scrollFunction of scrollFunctions)
            scrollFunction();

        // Check for a state change in any of the scroll in handlers.
        for(handler of scrollInHandlers)
        {
            let isOnPage = true;
            if(handler.checkX)
            {
                isOnPage = isElementOnPageX(handler.targetElement);
            }
            if(handler.checkY && isOnPage)
            {
                isOnPage = isElementOnPageY(handler.targetElement);
            }

            if(isOnPage !== handler.isVisible)
            {
                if(isOnPage)
                    handler.onTrigger();
                handler.isVisible = !(handler.isVisible);
            }
        }
        // Check for a state change in any of the scroll out handlers.
        for(handler of scrollOutHandlers)
        {
            let isOnPage = true;
            if(handler.checkX)
            {
                isOnPage = isElementOnPageX(handler.targetElement);
            }
            if(handler.checkY && isOnPage)
            {
                isOnPage = isElementOnPageY(handler.targetElement);
            }

            if(isOnPage !== handler.isVisible)
            {
                if(!isOnPage)
                    handler.onTrigger();
                handler.isVisible = !(handler.isVisible);
            }
        }
    };
    //#endregion

    //#region Define Color Palette
    CORE.COLOR_PALETTE.GRAPH.GRID_LINES = "#7F7F7F";
    CORE.COLOR_PALETTE.GRAPH.X_AXIS = "#C84646";
    CORE.COLOR_PALETTE.GRAPH.Y_AXIS = "#46C846";
    CORE.COLOR_PALETTE.GRAPH.NODE = "";
    //#endregion
    //#region Define Smoothing Functions
    CORE.EASE_INTERPOLANT = function(interpolant)
    {
        if (interpolant < 0) { return 0; }
        if (interpolant < 0.5)
        {
            // Accelerate up to the midway point.
            return 2 * Math.pow(interpolant, 2);
        }
        else if (interpolant < 1)
        {
            // Slow down after the midway point.
            return 1 - 2 * Math.pow((interpolant - 1), 2);
        }
        else { return 1; }
    };
    //#endregion
    //#region Define Event Binding
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
    CORE.CALL_ON_ELEMENT_SCROLL_IN = function(element, callback, axis)
    {
        // Do not add the handler if the element already has a handler.
        for(let i = 0; i < scrollInHandlers.length; i++)
            if(scrollInHandlers[i].targetElement === element)
                return;
        // Else create the new handler.
        let newHandler = 
        {
            targetElement: element,
            onTrigger: callback
        };
        // Store which axes should be checked.
        if(axis == "x" || axis == "X")
        {
            newHandler.checkX = true;
            newHandler.checkY = false;
            newHandler.isVisible = isElementOnPageX(element);
        }
        else if(axis == "y" || axis == "Y")
        {
            newHandler.checkX = false;
            newHandler.checkY = true;
            newHandler.isVisible = isElementOnPageY(element);
        }
        else
        {
            newHandler.checkX = true;
            newHandler.checkY = true;
            newHandler.isVisible = isElementOnPageX(element) && isElementOnPageY(element);
        }
        // Add the handler.
        scrollInHandlers.push(newHandler);
    };
    CORE.STOP_CALLING_ON_ELEMENT_SCROLL_IN = function(element)
    {
        for(let i = 0; i < scrollInHandlers.length; i++)
            if(scrollInHandlers[i].element === element)
                scrollInHandlers.splice(i, 1);
    };
    CORE.CALL_ON_ELEMENT_SCROLL_OUT = function(element, callback, axis)
    {
        // Do not add the handler if the element already has a handler.
        for(let i = 0; i < scrollOutHandlers.length; i++)
            if(scrollOutHandlers[i].targetElement === element)
                return;
        // Else create the new handler.
        let newHandler = 
        {
            targetElement: element,
            onTrigger: callback
        };
        // Store which axes should be checked.
        if(axis == "x" || axis == "X")
        {
            newHandler.checkX = true;
            newHandler.checkY = false;
            newHandler.isVisible = isElementOnPageX(element);
        }
        else if(axis == "y" || axis == "Y")
        {
            newHandler.checkX = false;
            newHandler.checkY = true;
            newHandler.isVisible = isElementOnPageY(element);
        }
        else
        {
            newHandler.checkX = true;
            newHandler.checkY = true;
            newHandler.isVisible = isElementOnPageX(element) && isElementOnPageY(element);
        }
        // Add the handler.
        scrollOutHandlers.push(newHandler);
    };
    CORE.STOP_CALLING_ON_ELEMENT_SCROLL_OUT = function(element)
    {
        for(let i = 0; i < scrollOutHandlers.length; i++)
            if(scrollOutHandlers[i].element === element)
                scrollOutHandlers.splice(i, 1);
    };
    CORE.CALL_RESIZE = function()
    {
        onResize();
    };
    //#endregion

    //#region Initialization
    // Ignite the update cycle.
    POLYFILL.CALL_ON_NEXT_DRAW_CYCLE(onUpdate);
    // Bind to the window's resize event.
    window.addEventListener('resize', onResize);
    // Bind to the window's scroll event.
    window.addEventListener('scroll', onScroll);
    // Prevent runtime modification to the core during runtime.
    Object.freeze(CORE);
    //#endregion
})();
//#endregion