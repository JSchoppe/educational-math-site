/** Base class for all drawers that talk to GraphOutput */
function Drawer()
{
    /**
     * Updates the internal references of the drawer
     * @param {GraphOutput} graphOutput The parent graph output object
     */
    this.SetGraphOutput = function(graphOutput)
    {
        this.gOut = graphOutput;
        this.gCanvas = graphOutput.GetCanvas();
        this.gContext = graphOutput.GetContext();
    };
}