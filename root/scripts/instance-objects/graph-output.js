/**
 * Creates a graph output object
 * @param {HTMLCanvasElement} canvasElement The canvas to output to
 */
function GraphOutput(canvasElement)
{
    //#region Private Members
    const canvas = canvasElement;
    const context = canvasElement.getContext("2d");
    // Stores the unit values at each edge of the canvas.
    let minX = -5; let maxX = 5;
    let minY = -5; let maxY = 5;
    // Stores the implementation, animation states, and
    // draw order of the graph objects, respectively.
    let drawCommands = {};
    let drawingProcesses = {};
    let processOrder = [];
    // Don't redraw the canvas if all animation states have completed.
    let isDormant = false;
    // Stores the current animation state of the viewport.
    let zoomProcess = null;
    let panProcess = null;
    // Stores the state related to direct user interaction.
    let isInteractable = true;
    //#endregion

    //#region Public Interface
    //#region Getters/Setters
    this.GetContext = function(){ return context; };
    this.GetCanvas = function(){ return canvas; };
    /**
     * Sets whether user input can directly affect the graph
     * @param {Boolean} isActive When true is passed the user can interact
     */
    this.SetInteractable = function(isActive){ isInteractable = isActive; };
    //#endregion
    //#region Graph Objects
    /**
     * Adds a drawer class that will control an object on the graph
     * @param {Drawer} drawer The object that implements the drawing procedure
     * @param {String} identity What will be used to refer to this object when drawing or erasing it
     */
    this.AddDrawCommand = function(drawer, identity)
    {
        // Existing command with same name will be overwritten.
        drawCommands[identity] = drawer;
        // Initialize the animation state for this object.
        drawingProcesses[identity] = 
        {
            isDormant: true,
            isForwards: false,
            startTime: 0, endTime: 0,
            completedCallback: null
        };
        // Push this new command to the back of the draw order by default.
        processOrder.push(identity);
    };
    /**
     * Draws an object onto the graph
     * @param {String} identity The name of the object to be drawn
     * @param {Number} [duration] The time it will take to draw this object
     * @param {Function} [callback] A function to call after the object has been drawn
     */
    this.DrawObject = function(identity, duration = 0, callback = null)
    {
        // Throw an error if the caller forgot to AddDrawCommand or misspelled the id.
        if(!drawCommands[identity])
            throw "Graph Output: Attempted to draw nonexistent id: " + identity;
        else
        {
            isDormant = false;
            // Update the animation state.
            drawingProcesses[identity] = 
            {
                isDormant: false,
                isForwards: true,
                startTime: POLYFILL.NOW(),
                endTime: POLYFILL.NOW() + duration,
                completedCallback: callback
            };
        }
    };
    /**
     * Erases an object from the graph
     * @param {String} identity The name of the object to be erased
     * @param {Number} [duration] The time it will take to erase this object
     * @param {Function} [callback] A function to call after the object has been erased
     */
    this.EraseObject = function(identity, duration = 0, callback = null)
    {
        // Throw an error if the caller forgot to AddDrawCommand or misspelled the id.
        if(!drawCommands[identity])
            throw "Graph Output: Attempted to erase nonexistent id: " + identity;
        else
        {
            isDormant = false;
            // Update the animation state.
            drawingProcesses[identity] = 
            {
                isDormant: false,
                isForwards: false,
                startTime: POLYFILL.NOW(),
                endTime: POLYFILL.NOW() + duration,
                completedCallback: callback
            };
        }
    };
    //#endregion
    //#region Conversion for Graph Objects
    /**
     * Converts from unit space to pixel space along the x axis
     * @param {Numbers} unitsX A value along the x axis in unit space
     */
    this.UnitsToPixelsX = function(unitsX)
    {
        return (unitsX - minX) / (maxX - minX) * canvas.width;
    };
    /**
     * Converts from unit space to pixel space along the y axis
     * @param {Numbers} unitsY A value along the y axis in unit space
     */
    this.UnitsToPixelsY = function(unitsY)
    {
        return canvas.height - (unitsY - minY) / (maxY - minY) * canvas.height;
    };
    /**
     * Converts from pixel space to unit space along the x axis
     * @param {Numbers} pixelsX A value along the x axis in pixel space
     */
    this.PixelsToUnitsX = function(pixelsX)
    {
        return minX + pixelsX * (maxX - minX) / canvas.width;
    };
    /**
     * Converts from pixel space to unit space along the y axis
     * @param {Numbers} pixelsY A value along the y axis in pixel space
     */
    this.PixelsToUnitsY = function(pixelsY)
    {
        return minY + (maxY - minY) * (canvas.height - pixelsY) / canvas.height;
    };
    //#endregion
    //#region Viewport Translation and Scaling
    /**
     * Moves the graph so that the given rectangle is inside the viewport
     * @param {Number} xMin The minimum x value gauranteed visible
     * @param {Number} xMax The maximum x value gauranteed visible
     * @param {Number} yMin The minimum y value gauranteed visible
     * @param {Number} yMax The maximum y value gauranteed visible
     * @param {Number} [duration] How long it will take to move the viewport
     * @param {Function} [callback] Function to be called after the process completes
     */
    this.WindowToBoundingBox = function(xMin, xMax, yMin, yMax, duration = 0, callback)
    {
        // Calculate the travel edistance.
        const panDistanceX = 0.5*(xMin + xMax) - 0.5*(minX + maxX);
        const panDistanceY = 0.5*(yMin + yMax) - 0.5*(minY + maxY);
        // Choose the more less restrictive scale factor.
        const scaleFactorX = (xMax - xMin) / (maxX - minX);
        const scaleFactorY = (yMax - yMin) / (maxY - minY);
        const scaleFactor = Math.max(scaleFactorX, scaleFactorY);
        // Begin the pan and zoom procedures, forwarding the given callback.
        this.Pan(panDistanceX, panDistanceY, duration, callback);
        this.Zoom(scaleFactor, duration);
    };
    this.WindowToBoundingBox = this.WindowToBoundingBox.bind(this);
    /**
     * Translates the viewport relative to its current position
     * @param {Number} unitsX Translation along the x axis
     * @param {Number} unitsY Translation along the y axis
     * @param {Number} [duration] How long it will take to complete the pan
     * @param {Function} [callback] Function to be called after the pan completes  
     */
    this.Pan = function(unitsX, unitsY, duration = 0, callback)
    {
        // Pass arguments into the current pan process.
        const currentX = 0.5*(maxX + minX);
        const currentY = 0.5*(maxY + minY);
        panProcess = 
        {
            startX: currentX,
            startY: currentY,
            endX: currentX + unitsX,
            endY: currentY + unitsY,
            startTime: POLYFILL.NOW(),
            endTime: POLYFILL.NOW() + duration,
            completedCallback: callback
        };
    };
    /**
     * Scales the viewport relative to the current zoom
     * @param {Number} scaleFactor The new scale relative to the current scale 1
     * @param {Number} [duration] How long it will take to complete the zoom
     * @param {Function} [callback] Function to be called after the zoom completes
     */
    this.Zoom = function(scaleFactor, duration = 0, callback)
    {
        // Pass arguments in the current zoom process.
        const unitsHeight = maxY - minY;
        zoomProcess = 
        {
            startScale: unitsHeight,
            endScale: unitsHeight * scaleFactor,
            startTime: POLYFILL.NOW(),
            endTime: POLYFILL.NOW() + duration,
            completedCallback: callback
        };
    };
    //#endregion
    //#endregion
    //#region Private Functions
    //#region Viewport Modification
    const zoom = function(zoom, interpolant = 1)
    {
        // Rescale the y axis relative to the current center.
        const currentScale = zoom.startScale + (zoom.endScale - zoom.startScale) * interpolant;
        const centerY = 0.5*(minY + maxY);
        minY = centerY - 0.5*currentScale;
        maxY = centerY + 0.5*currentScale;
        // Recalculate the x axis.
        equalizeAxesScale();
    };
    const pan = function(pan, interpolant = 1)
    {
        // Calculate where the viewport should current be centered.
        const currentX = pan.startX + (pan.endX - pan.startX) * interpolant;
        const currentY = pan.startY + (pan.endY - pan.startY) * interpolant;
        // Calculate the travel from the current position.
        const deltaX = currentX - 0.5*(minX + maxX);
        const deltaY = currentY - 0.5*(minY + maxY);
        // Apply the pan.
        minX += deltaX; maxX += deltaX;
        minY += deltaY; maxY += deltaY;
    };
    const equalizeAxesScale = function()
    {
        // Make the x scale proportional to the y scale.
        const rangeX = (maxY - minY) * (canvas.width / canvas.height);
        const centerX = (minX + maxX) * 0.5;
        minX = centerX - 0.5*rangeX;
        maxX = centerX + 0.5*rangeX;
    };
    //#endregion
    //#region User Input
    const onResize = function()
    {
        equalizeAxesScale();
        isDormant = false;
    };
    const onScrollWheel = function(args)
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
        }
    };
    
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
    //#region Update Loop
    let update = function()
    {
        // If there are no changing elements, the canvas
        // can remain in the same drawn state.
        if(isDormant){ return; }

        // Clear the previous drawn frame.
        context.clearRect(0, 0, canvas.width, canvas.height);
        const now = POLYFILL.NOW();
        // If everything is dormant this frame, drawing will stop.
        isDormant = true;

        // Update any panning or zooming first.
        if(panProcess)
        {
            isDormant = false;
            const interpolant = (now - panProcess.startTime) / (panProcess.endTime - panProcess.startTime);
            if(interpolant > 1)
            {
                // Once the pan is complete, terminate the process.
                pan(panProcess, 1);
                panProcess = null;
            }
            else
                pan(panProcess, interpolant);
        }
        if(zoomProcess)
        {
            isDormant = false;
            const interpolant = (now - zoomProcess.startTime) / (zoomProcess.endTime - zoomProcess.startTime);
            if(interpolant > 1)
            {
                // Once the zoom is complete, terminate the process.
                zoom(zoomProcess, 1);
                zoomProcess = null;
            }
            else
                zoom(zoomProcess, interpolant);
        }

        // Redraw all objects.
        for(processID of processOrder)
        {
            process = drawingProcesses[processID];
            command = drawCommands[processID];

            // If the process is dormant only redraw if its in the completed state.
            if(process.isDormant)
            {
                if(process.isForwards)
                    command.Draw(this, 1);
            }
            // Draw the object in its intermediate animation state.
            else
            {
                isDormant = false;
                let interpolant = (now - process.startTime) / (process.endTime - process.startTime);
                if(process.isForwards)
                {
                    if(interpolant > 1)
                    {
                        command.Draw(this, 1);
                        process.isDormant = true;
                        if(process.completedCallback)
                            process.completedCallback();
                    }
                    else
                        command.Draw(this, interpolant);
                }
                else
                {
                    interpolant = 1 - interpolant;
                    if(interpolant < 0)
                    {
                        process.isDormant = true;
                        if(process.completedCallback)
                            process.completedCallback();
                    }
                    else
                        command.Draw(this, interpolant);
                }
            }
        }
    };
    update = update.bind(this);
    //#endregion
    //#endregion

    //#region Initialization
    CORE.CALL_ON_UPDATE(update);
    // Make the axes scales equal.
    (new ScalingCanvas(canvasElement)).CallOnSizeChanged(onResize);
    equalizeAxesScale();
    // Bind events to interactions with the canvas
    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mousemove", dragDuring);
    canvas.addEventListener("wheel", onScrollWheel);
    //#endregion
}