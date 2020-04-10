/**
 * Makes an image element alter its source based on a boolean state
 * @param {HTMLElement} imgElement
 * @param {String} [onTag]
 * @param {String} [offTag]
 */
function OnOffIcon(imgElement, onTag = "on", offTag = "off")
{
    const img = imgElement;
    const onSourcePath = FILE_HELPER.SWAP_FINAL_KEBAB_COMPONENT(img.src, onTag);
    const offSourcePath = FILE_HELPER.SWAP_FINAL_KEBAB_COMPONENT(img.src, offTag);

    this.TurnOn = function()
    {
        img.src = onSourcePath;
    };

    this.TurnOff = function()
    {
        img.src = offSourcePath;
    };
}