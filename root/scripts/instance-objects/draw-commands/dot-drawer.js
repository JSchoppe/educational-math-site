/**
 * Draws a dot onto the graph output
 * @param {Number} [unitsX] The x position of the dot in unit space 
 * @param {Number} [unitsY] The y position of the dot in unit space
 */
function DotDrawer(unitsX = 0, unitsY = 0)
{
    // Define the size of the dot.
    const maxRadius = 5;

    let x = unitsX;
    let y = unitsY;

    /**
     * Changes the position of the dot in unit space
     * @param {Number} newX The new x coordinate
     * @param {Number} newY The new y coordinate
     */
    this.SetPosition = function(newX, newY)
    {
        x = newX;
        y = newY;
    };

    /**
     * Draws a function on the graph output
     * @param {GraphOutput} graphOutput The graph output to draw to
     * @param {interpolant} [interpolant] How much of this object should be drawn this frame
     */
    this.Draw = function(gOut, interpolant = 1)
    {
        const radius = interpolant * maxRadius;
        const ctx = gOut.GetContext();

        if(radius > 0)
        {
            ctx.beginPath();
            ctx.arc(gOut.UnitsToPixelsX(x), gOut.UnitsToPixelsY(y), radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    };
}