/**
 * Creates a graph output object
 * @param {HTMLCanvasElement} canvasElement The canvas to output to
 */
function GraphOutput(canvasElement)
{
    //#region Private Members
    const canvas = canvasElement;
    const context = canvasElement.getContext("2d");
    let minX = -5;
    let maxX = 5;
    let minY = -5;
    let maxY = 5;
    let functions = {}; // Stores the functions used to draw this graph.
    
    //#endregion
    //#region Public Interface
    //#region Editing Mathematical Functions
    /**
     * Sets a function that this graph can draw
     * @param {Function} func The f(x) mathematical function
     * @param {String} slotName The 
     */
    this.SetFunctionSlot = function(func, slotName)
    {
        // Set the passed math function to a property of functions.
        functions[slotName] = func;
    };
    /**Clears the list of functions this graph can draw*/
    this.ClearAllFunctions = function()
    {
        // Clear all properties inside local functions.
        functions = {};
    };
    //#endregion
    /**
     * Prompts the graph to start drawing a function
     * @param {(String|Function)} func Either a literal function, or a string referencing a function slot
     */
    this.DrawFunction = function(func)
    {
        // If the input is a function, automatically create a slot for it.
        if(func instanceof Function)
        {

        }
        else 
        {
            func = functions[func];
        }

        context.beginPath();
        let startX = pixelsToUnitsX(-1);
        let startY = func(startX);
        context.moveTo(unitsToPixelsX(startX), unitsToPixelsY(startY));

        context.lineWidth = 2;
        context.strokeStyle = "#FFFFFF";
        for(let pixel = 0; pixel <= canvas.width + 1; pixel++)
        {
            let inputX = pixelsToUnitsX(pixel);
            let outputY = func(inputX);
            context.lineTo(unitsToPixelsX(inputX), unitsToPixelsY(outputY));
        }
        context.stroke();
    };
    /**
     * Interpolates drawing from one function to another
     * @param {String} fromSlot The function to start at
     * @param {String} endSlot The function to end at
     * @param {Number} [duration] The time in seconds to transition from one graph to another 
     */
    this.MorphFunction = function(fromSlot, toSlot, duration = 1)
    {

    };
    /**
     * Draws the unit grid onto the canvas
     * @param {Number} [step] The unit distance between gridlines
     * @param {Number} [drawDuration] The time in seconds to draw the grid
     * @param {Function} [callback] Function to call once the grid has completed drawing
     */
    this.DrawGrid = function(step = 1, drawDuration = 0, callback)
    {
        //#region Draw the grid lines
        context.lineWidth = 2;
        context.strokeStyle = CORE.COLOR_PALETTE.GRAPH.GRID_LINES;
        for(let x = Math.floor(minX); x <= Math.ceil(maxX); x += step)
        {
            context.beginPath();
            context.moveTo(unitsToPixelsX(x), 0);
            context.lineTo(unitsToPixelsX(x), canvas.height);
            context.stroke();
        }
        for(let y = Math.floor(minY); y <= Math.ceil(maxY); y += step)
        {
            context.beginPath();
            context.moveTo(0, unitsToPixelsY(y));
            context.lineTo(canvas.width, unitsToPixelsY(y));
            context.stroke();
        }
        //#endregion

        context.lineWidth = 4;

        context.strokeStyle = CORE.COLOR_PALETTE.GRAPH.X_AXIS;
        context.beginPath();
        context.moveTo(0, unitsToPixelsY(0));
        context.lineTo(canvas.width, unitsToPixelsY(0));
        context.stroke();

        context.strokeStyle = CORE.COLOR_PALETTE.GRAPH.Y_AXIS;
        context.beginPath();
        context.moveTo(unitsToPixelsX(0), 0);
        context.lineTo(unitsToPixelsX(0), canvas.height);
        context.stroke();

    };
    //#endregion
    //#region Private Functions
    //#region Convert to and from pixel and unit space
    let unitsToPixelsX = function(unitsX)
    {
        return (unitsX - minX) / (maxX - minX) * canvas.width;
    };
    let unitsToPixelsY = function(unitsY)
    {
        return canvas.height - (unitsY - minY) / (maxY - minY) * canvas.height;
    };
    let pixelsToUnitsX = function(pixelsX)
    {
        return minX + pixelsX * (maxX - minX) / canvas.width;
    };
    let pixelsToUnitsY = function(pixelsY)
    {
        return minY + (maxY - minY) * (canvas.height - pixelsY) / pixelsHeight;
    };
    //#endregion
    


    // Update is called whenever something is being drawn over time.
    let update = function(deltaTime)
    {
        // Start by clearing the canvas.
        clear();
    };


    let clear = function()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    let equalizeAxesScale = function()
    {
        let rangeY = maxY - minY;
        let rangeX = rangeY * (canvas.width / canvas.height);
        let currentMiddleX = (minX + maxX) * 0.5;
        minX = currentMiddleX - 0.5 * rangeX;
        maxX = currentMiddleX + 0.5 * rangeX;
    };
    equalizeAxesScale();

    let onResize = function()
    {
        canvas.width = canvas.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
    };


    let onScrollWheel = function(args)
    {
        if (args.deltaY > 0)
        {
            minX *= 0.8;
            maxX *= 0.8;
            minY *= 0.8;
            maxY *= 0.8;
        }
        else
        {
            minX *= 1.25;
            maxX *= 1.25;
            minY *= 1.25;
            maxY *= 1.25;
        }
        clear();
        this.DrawGrid();
        for(const func in functions)
        {
            this.DrawFunction(func);
        }
    };
    onScrollWheel = onScrollWheel.bind(this);


    let dragStartX, dragStartY, minXStart, minYStart, maxXStart, maxYStart;
    let dragStart = function(args)
    {
        dragStartX = args.clientX;
        dragStartY = args.clientY;
    };
    let dragDuring = function(args)
    {
        
    };
    dragStart = dragStart.bind(this);
    dragDuring = dragDuring.bind(this);

    //#endregion
    //#region Initialization
    // Set the canvas to the same number of pixels as its screen space.
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    // Bind events to interactions with the canvas
    CORE.CALL_ON_RESIZE(onResize);
    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mousemove", dragDuring);
    canvas.addEventListener("wheel", onScrollWheel);
    //#endregion
}