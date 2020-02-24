// Define local page behavior for the lagrange polynomial.
(function()
{
    //#region Get Page References
    const canvas = document.querySelector("canvas");
    //#endregion

    let LagrangeGraph = new GraphOutput(canvas);

    LagrangeGraph.DrawGrid();
    LagrangeGraph.SetFunctionSlot((x)=>{ return x*x; }, "Parabola");
    LagrangeGraph.SetFunctionSlot((x)=>{ return -(x*x); }, "InverseParabola");
    LagrangeGraph.DrawFunction("Parabola");

})();