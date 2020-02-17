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
    let minX = 10;
    let maxX = 10;
    let minY = 10;
    let maxY = 10;
    let functions = [];

    // Implement the public interface for interacting with the graph.

    this.DrawFunction = function()
    {
        
    };
    this.MorphFunction = function()
    {

    };
    
}