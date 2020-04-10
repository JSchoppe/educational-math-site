//#region Public Interface
/**Provides methods for working with file paths*/
const FILE_HELPER =
{
    /**
     * Swaps out the path text after the final dash and before the extension
     * @param {String} path The original source path
     * @param {String} newEnding The component to swap in
     */
    SWAP_FINAL_KEBAB_COMPONENT: function(path, newEnding){ return ""; }
};
//#endregion
//#region Implementation
(function()
{
    // This method is used to change asset paths based on naming suffixes:
    // IN:  .../images/button-on.svg
    // OUT: .../images/button-off.svg
    FILE_HELPER.SWAP_FINAL_KEBAB_COMPONENT = function(path, newEnding)
    {
        let constructedPath = "";
        let constructedChunk = "";
        for(let i = 0; i < path.length; i++)
        {
            constructedChunk += path[i];
            if(path[i] == '-')
            {
                constructedPath += constructedChunk;
            }
        }
        constructedPath += newEnding;
        return constructedPath;
    };

    Object.freeze(FILE_HELPER);
})();
//#endregion