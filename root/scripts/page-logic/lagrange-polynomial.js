// Define local page behavior for the lagrange polynomial.
(function()
{
    const canvas = document.querySelector("canvas");

    let LagrangeGraph = new GraphOutput(canvas);

    LagrangeGraph.DrawGrid();
    LagrangeGraph.DrawFunction((x)=>{ return Math.cos(x) / 0.5 * x; })

})();