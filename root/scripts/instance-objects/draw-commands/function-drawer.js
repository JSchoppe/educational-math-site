function FunctionDrawer(oneToOneFunction)
{
    Drawer.call(this);

    const f = oneToOneFunction;

    let verticalAsymptotes = [];
    const asymptoteStep = 0.000001;

    this.AddVerticalAsymptote = function(locationX)
    {

    };

    /**
     * Draws a function on the graph output
     * @param {interpolant} [interpolant] How much of this object should be drawn this frame
     */
    this.Draw = function(interpolant = 1)
    {
        this.gContext.strokeStyle = "#FFFFFF";
        this.gContext.lineWidth = 3;

        this.gContext.beginPath();
        
        let startX = this.gOut.PixelsToUnitsX(-1);
        let startY = f(startX);
        this.gContext.moveTo(this.gOut.UnitsToPixelsX(startX), this.gOut.UnitsToPixelsY(startY));
        for(let pixel = 0; pixel <= (this.gOut.GetCanvas().width + 1) * interpolant; pixel++)
        {
            let inputX = this.gOut.PixelsToUnitsX(pixel);
            let outputY = f(inputX);
            this.gContext.lineTo(this.gOut.UnitsToPixelsX(inputX), this.gOut.UnitsToPixelsY(outputY));
        }
        this.gContext.stroke();
    };
}