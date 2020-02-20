/**
 * Creates a graph output object
 * @param {HTMLCanvasElement} canvasElement The canvas to output to
 */
function GraphOutput(canvasElement)
{
    // Declare private references. 
    const canvas = canvasElement;
    const context = canvasElement.getContext("2d");

    // Declare private variables.
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    let pixelWidth = canvas.getBoundingClientRect().width;
    let pixelHeight = canvas.getBoundingClientRect().height;
    let minX = -5;
    let maxX = 5;
    let minY = -5;
    let maxY = 5;
    let functions = [];

    // Implement the public interface for interacting with the graph.

    this.DrawFunction = function(f)
    {
        context.beginPath();
        let startX = pixelsToUnitsX(-1);
        let startY = f(startX);
        context.moveTo(unitsToPixelsX(startX), unitsToPixelsY(startY));

        context.lineWidth = 2;
        context.strokeStyle = "#FFFFFF";
        for(let pixel = 0; pixel <= pixelWidth + 1; pixel++)
        {
            let inputX = pixelsToUnitsX(pixel);
            let outputY = f(inputX);
            context.lineTo(unitsToPixelsX(inputX), unitsToPixelsY(outputY));
        }
        context.stroke();
    };
    this.MorphFunction = function()
    {

    };
    this.DrawGrid = function()
    {
        context.lineWidth = 4;
        context.strokeStyle = "#FF0000";
        for(let x = minX; x <= maxX; x++)
        {
            context.beginPath();
            context.moveTo(unitsToPixelsX(x), 0);
            context.lineTo(unitsToPixelsX(x), pixelHeight);
            context.stroke();
        }

        for(let y = minY; y <= maxY; y++)
        {
            context.beginPath();
            context.moveTo(0, unitsToPixelsY(y));
            context.lineTo(pixelWidth, unitsToPixelsY(y));
            context.stroke();
        }
    };

    let unitsToPixelsX = function(unitsX)
    {
        return (unitsX - minX) / (maxX - minX) * pixelWidth;
    };
    let unitsToPixelsY = function(unitsY)
    {
        return pixelHeight - (unitsY - minY) / (maxY - minY) * pixelHeight;
    };
    let pixelsToUnitsX = function(pixelsX)
    {
        return minX + pixelsX * (maxX - minX) / pixelWidth;
    };
    let pixelsToUnitsY = function(pixelsY)
    {
        return minY + (maxY - minY) * (pixelHeight - pixelsY) / pixelsHeight;
    };
    
    let clear = function()
    {
        context.clearRect(0, 0, pixelWidth, pixelHeight);
    };

    let onResize = function()
    {
        pixelsX = canvas.width;
        pixelsY = canvas.height;
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
        //this.DrawGrid();
        this.DrawFunction((x)=>{ return Math.cos(x) / 0.5 * x; })
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
    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mousemove", dragDuring);

    canvas.addEventListener("wheel", onScrollWheel);
    CORE.CALL_ON_RESIZE(onResize);
    
}