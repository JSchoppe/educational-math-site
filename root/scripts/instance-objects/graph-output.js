/**
 * Creates a graph output object
 * @param {HTMLCanvasElement} canvasElement The canvas to output to
 */
function GraphOutput(canvasElement)
{
    //#region Private Enums
    const INSTRUCTION_TYPE =
    {
        FUNCTION: 0,
        GRID: 1,
        PAN: 2,
        ZOOM: 3
    };
    //#endregion
    //#region Private Structures
    const GraphFunction = function(func)
    {
        this.f = func;
    };
    //#endregion
    //#region Private Members
    const canvas = canvasElement;
    const context = canvasElement.getContext("2d");
    let minX = -5; let maxX = 5;
    let minY = -5; let maxY = 5;
    let functions = {};
    let updateInstructions = [];
    let isInteractable = true;
    //#endregion

    //#region Public Interface
    //#region Editing Mathematical Functions
    /**
     * Sets a function that this graph can draw
     * @param {Function} func The f(x) mathematical function
     * @param {String} slotName The name used to refer to this function
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
     * @param {String} func The function slot name
     */
    this.DrawFunction = function(func, drawDuration = 0, callback)
    {
        // Retrieve the function.
        func = functions[func];

        if(drawDuration)
        {
            updateInstructions.push(
            {
                type: INSTRUCTION_TYPE.FUNCTION,
                startTime: POLYFILL.NOW(),
                duration: drawDuration,
                toDraw: func
            });
            CORE.CALL_ON_UPDATE(update);
        }
        else
        {
            drawFunction(func);
        }
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
        if(drawDuration)
        {
            updateInstructions.push(
            {
                type: INSTRUCTION_TYPE.GRID,
                startTime: POLYFILL.NOW(),
                duration: drawDuration
            });
            CORE.CALL_ON_UPDATE(update);
        }
        else
        {
            drawGrid();
        }
    };

    this.PanToBoundingBox = function(xMin, xMax, yMin, yMax, drawDuration = 1)
    {
        if(drawDuration)
        {
            updateInstructions.push(
            {
                type: INSTRUCTION_TYPE.GRID,
                startTime: POLYFILL.NOW(),
                duration: drawDuration
            });
            CORE.CALL_ON_UPDATE(update);
        }
        else
        {
            drawGrid();
        }
    };


    /**
     * Sets whether user input can directly affect the graph
     * @param {Boolean} isActive When true is passed the user can interact
     */
    this.SetInteractable = function(isActive)
    {
        isInteractable = isActive;
    };
    //#endregion
    //#region Private Functions

    let drawFunction = function(f, interpolant = 1)
    {
        context.lineWidth = 2;
        context.strokeStyle = "#FFFFFF";

        context.beginPath();
        let startX = pixelsToUnitsX(-1);
        let startY = f(startX);
        context.moveTo(unitsToPixelsX(startX), unitsToPixelsY(startY));
        for(let pixel = 0; pixel <= (canvas.width + 1) * interpolant; pixel++)
        {
            let inputX = pixelsToUnitsX(pixel);
            let outputY = f(inputX);
            context.lineTo(unitsToPixelsX(inputX), unitsToPixelsY(outputY));
        }
        context.stroke();
    };

    let drawGrid = function(unitSize = 1, interpolant = 1)
    {
        context.lineWidth = 2;
        context.strokeStyle = CORE.COLOR_PALETTE.GRAPH.GRID_LINES;
        for(let x = Math.floor(minX); x <= Math.ceil(maxX); x += unitSize)
        {
            context.beginPath();
            context.moveTo(unitsToPixelsX(x), 0);
            context.lineTo(unitsToPixelsX(x), canvas.height * interpolant);
            context.stroke();
        }
        for(let y = Math.floor(minY); y <= Math.ceil(maxY); y += unitSize)
        {
            context.beginPath();
            context.moveTo(0, unitsToPixelsY(y));
            context.lineTo(canvas.width * interpolant, unitsToPixelsY(y));
            context.stroke();
        }

        context.lineWidth = 4;

        context.strokeStyle = CORE.COLOR_PALETTE.GRAPH.X_AXIS;
        context.beginPath();
        context.moveTo(0, unitsToPixelsY(0));
        context.lineTo(canvas.width * interpolant, unitsToPixelsY(0));
        context.stroke();

        context.strokeStyle = CORE.COLOR_PALETTE.GRAPH.Y_AXIS;
        context.beginPath();
        context.moveTo(unitsToPixelsX(0), 0);
        context.lineTo(unitsToPixelsX(0), canvas.height * interpolant);
        context.stroke();
    };

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
        // If all draw instructions have completed, unbind from update.
        if(updateInstructions.length === 0)
        {
            CORE.STOP_CALLING_ON_UPDATE(update);
        }

        // Start by clearing the canvas.
        clear();

        for(let i = 0; i < updateInstructions.length; i++)
        {
            let interpolant = (POLYFILL.NOW() - updateInstructions[i].startTime) / updateInstructions[i].duration;
            switch(updateInstructions[i].type)
            {
                case INSTRUCTION_TYPE.FUNCTION:
                    if (interpolant > 1)
                    {
                        interpolant = 1;
                    }
                    drawFunction(updateInstructions[i].toDraw, interpolant);
                    break;
                case INSTRUCTION_TYPE.GRID:
                    if (interpolant > 1)
                    {
                        interpolant = 1;
                    }
                    drawGrid(1, interpolant);
                    break;
            }


        }

    };
    update = update.bind(this);


    let clear = function()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Resizes the graph's bounding units to equalize X and Y
    let equalizeAxesScale = function()
    {
        let rangeY = maxY - minY;
        let rangeX = rangeY * (canvas.width / canvas.height);
        let currentMiddleX = (minX + maxX) * 0.5;
        minX = currentMiddleX - 0.5 * rangeX;
        maxX = currentMiddleX + 0.5 * rangeX;
    };
    // 
    let onResize = function()
    {
        canvas.width = canvas.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
        equalizeAxesScale();
        clear();
        this.DrawGrid();
    };
    onResize = onResize.bind(this);
    
    
    let onScrollWheel = function(args)
    {
        if (isInteractable)
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
    // Make the axes scales equal.
    equalizeAxesScale();
    // Bind events to interactions with the canvas
    CORE.CALL_ON_RESIZE(onResize);
    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mousemove", dragDuring);
    canvas.addEventListener("wheel", onScrollWheel);
    //#endregion
}