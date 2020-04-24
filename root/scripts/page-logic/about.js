// Define local page behavior for the about page.
(function()
{
    const Graph = new GraphOutput(document.querySelector("canvas"));
    Graph.SetInteractable(false);

    Graph.AddDrawCommand(new GridDrawer(1, 4), "grid")
    Graph.DrawObject("grid");
})();