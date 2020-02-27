// Define local page behavior for the lagrange polynomial.
(function()
{
    //#region Get Page References
    const canvas = document.querySelector("canvas");
    //#endregion

    let LagrangeGraph = new GraphOutput(canvas);

    LagrangeGraph.SetFunctionSlot((x)=>{ return Math.sin(x); }, "Parabola");
    LagrangeGraph.SetFunctionSlot((x)=>{ return 2*Math.cos(x); }, "Parabola2");
    LagrangeGraph.DrawGrid(1, 2);
    LagrangeGraph.DrawFunction("Parabola", 2);
    LagrangeGraph.DrawFunction("Parabola2", 2);

})();