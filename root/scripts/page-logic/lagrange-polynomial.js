// Define local page behavior for the lagrange polynomial.
(function()
{

    const settingsButton = document.querySelector("#settings-tab");
    const settingsContent = document.querySelector("#settings-content");

    settingsButton.addEventListener("click", ()=>
    {
        settingsContent.classList.toggle("hidden");
        // Since revealing or hiding the menu changes the graph size:
        CORE.CALL_RESIZE();
    });






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