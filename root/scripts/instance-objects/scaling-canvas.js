/**
 * Creates a canvas that automatically scales its pixel density to match the screen
 * @param {HTMLCanvasElement} canvas The canvas element to scale
 */
function ScalingCanvas(canvasElement)
{
    //#region Private Members
    const canvas = canvasElement;
    const sizeChangedCallbacks = [];
    const onResize = function()
    {
        canvas.width = canvas.getBoundingClientRect().width * window.devicePixelRatio;
        canvas.height = canvas.getBoundingClientRect().height * window.devicePixelRatio;
        for(callback of sizeChangedCallbacks){ callback(); }
    };
    //#endregion
    //#region Public Interface
    /**
     * Calls a function after the size of the canvas has been recalculated
     * @param {Function} callback The function to call on size changed
     */
    this.CallOnSizeChanged = function(callback)
    {
        sizeChangedCallbacks.push(callback);
    };
    //#endregion
    //#region Initialization
    CORE.CALL_ON_RESIZE(onResize);
    onResize();
    //#endregion
}