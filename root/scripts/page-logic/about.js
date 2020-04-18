// Define local page behavior for the about page.
(function()
{
    const Graph = new GraphOutput(document.querySelector("canvas"));
    Graph.SetInteractable(false);

    Graph.SetFunctionSlot((x)=>{ return x + Math.sin(x); }, "Trig");
    Graph.DrawGrid();
    Graph.DrawFunction("Trig");
})();