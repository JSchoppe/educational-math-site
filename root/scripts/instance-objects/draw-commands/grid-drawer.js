/**
 * Draws a grid onto the graph output
 * @param {Number} minorStep In units, how often minor grid lines occur
 * @param {Number} majorStep How many minor lines between each major line
 */
function GridDrawer(minorStep = 1, majorStep = 4)
{
    //#region Private Members
    let step = minorStep;
    let majorIndexCoefficient = Math.floor(majorStep);
    // Default styling.
    let minorColor = "#4C4C4C";
    let majorColor = "#B7B7B7";
    let xColor = "#AA0000";
    let yColor = "#00AA00";
    const minorThickness = 1;
    const majorThickness = 2;
    const axisThickness = 3;
    const minPixelGap = 16;
    //#endregion
    //#region Public Interface
    /**
     * Sets the color palette for this grid
     * @param {String} minor The hex color for the minor grid lines
     * @param {String} major The hex color for the major grid lines
     * @param {String} xAxis The hex color for the x axis
     * @param {String} yAxis The hex color for the y axis
     */
    this.SetColors = function(minor, major, xAxis, yAxis)
    {
        minorColor = minor;
        majorColor = major;
        xColor = xAxis;
        yColor = yAxis;
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
        const width = gOut.GetCanvas().width;
        const height = gOut.GetCanvas().height;
        const leftEdgeX = gOut.PixelsToUnitsX(-1);
        const rightEdgeX = gOut.PixelsToUnitsX(width + 1);
        const topEdgeY = gOut.PixelsToUnitsY(-1);
        const bottomEdgeY = gOut.PixelsToUnitsY(height + 1);
        // Collect major lines that are stepped over.
        let majorLinesX = [];
        let majorLinesY = [];

        ctx.strokeStyle = minorColor;
        ctx.lineWidth = minorThickness;
        // Draw the minor grid lines in both directions.
        let stepX = Math.ceil(leftEdgeX / step);
        let finalStepX = Math.ceil(rightEdgeX / step);
        while(stepX < finalStepX)
        {
            // Check if the current grid line is major.
            if(stepX % majorIndexCoefficient != 0)
            {
                ctx.beginPath();
                ctx.moveTo(gOut.UnitsToPixelsX(stepX * step), -1);
                ctx.lineTo(gOut.UnitsToPixelsX(stepX * step), interpolant * (height + 1));
                ctx.stroke();
            }
            else if(stepX != 0)
            {
                majorLinesX.push(stepX);
            }
            stepX++;
        }
        let stepY = Math.ceil(bottomEdgeY / step);
        let finalStepY = Math.ceil(topEdgeY / step);
        while(stepY < finalStepY)
        {
            // Check if the current grid line is major.
            if(stepY % majorIndexCoefficient != 0)
            {
                ctx.beginPath();
                ctx.moveTo(-1, gOut.UnitsToPixelsY(stepY * step));
                ctx.lineTo(interpolant * (width + 1), gOut.UnitsToPixelsY(stepY * step));
                ctx.stroke();
            }
            else if(stepY != 0)
            {
                majorLinesY.push(stepY);
            }
            stepY++;
        }

        // Draw any major lines that have been stepped over in the previous step.
        ctx.strokeStyle = majorColor;
        ctx.lineWidth = majorThickness;
        for(x of majorLinesX)
        {
            ctx.beginPath();
            ctx.moveTo(gOut.UnitsToPixelsX(x * step), -1);
            ctx.lineTo(gOut.UnitsToPixelsX(x * step), interpolant * (height + 1));
            ctx.stroke();
        }
        for(y of majorLinesY)
        {
            ctx.beginPath();
            ctx.moveTo(-1, gOut.UnitsToPixelsY(y * step));
            ctx.lineTo(interpolant * (width + 1), gOut.UnitsToPixelsY(y * step));
            ctx.stroke();
        }

        // Draw the origin axis lines if they are in the viewport.
        ctx.lineWidth = axisThickness;
        if(leftEdgeX < 0 && rightEdgeX > 0)
        {
            ctx.strokeStyle = yColor;
            ctx.beginPath();
            ctx.moveTo(gOut.UnitsToPixelsX(0), -1);
            ctx.lineTo(gOut.UnitsToPixelsX(0), interpolant * (height + 1));
            ctx.stroke();
        }
        if(bottomEdgeY < 0 && topEdgeY > 0)
        {
            ctx.strokeStyle = xColor;
            ctx.beginPath();
            ctx.moveTo(-1, gOut.UnitsToPixelsY(0));
            ctx.lineTo(interpolant * (width + 1), gOut.UnitsToPixelsY(0));
            ctx.stroke();
        }
    };
    //#endregion
}