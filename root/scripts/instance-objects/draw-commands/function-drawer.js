function FunctionDrawer(oneToOneFunction)
{
    const f = oneToOneFunction;

    let verticalAsymptotes = [];
    const asymptoteStep = 0.000001;

    this.AddVerticalAsymptote = function(locationX)
    {

    };

    /**
     * Draws a function on the graph output
     * @param {GraphOutput} graphOutput The graph output to draw to
     * @param {interpolant} [interpolant] How much of this object should be drawn this frame
     */
    this.Draw = function(gOut, interpolant = 1)
    {
        // Retrieve information from the graph output.
        const ctx = gOut.GetContext();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;

        ctx.beginPath();
        
        let startX = gOut.PixelsToUnitsX(-1);
        let startY = f(startX);
        ctx.moveTo(gOut.UnitsToPixelsX(startX), gOut.UnitsToPixelsY(startY));
        for(let pixel = 0; pixel <= (gOut.GetCanvas().width + 1) * interpolant; pixel++)
        {
            let inputX = gOut.PixelsToUnitsX(pixel);
            let outputY = f(inputX);
            ctx.lineTo(gOut.UnitsToPixelsX(inputX), gOut.UnitsToPixelsY(outputY));
        }
        ctx.stroke();
    };
}