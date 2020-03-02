// Define local page behavior for the homepage.
(function()
{
    let nav = document.querySelector("nav");
    let navPullTab = document.querySelector("#nav-pull-tab");

    navPullTab.addEventListener("click", ()=>
    {
        nav.classList.toggle("mobile-collapsed");
    });

    let LagrangeDemoGraph = new GraphOutput(document.querySelector("#lagrange-canvas"));
    let COGDemoGraph = new GraphOutput(document.querySelector("#center-of-gravity-canvas"));
    let SplineDemoGraph = new GraphOutput(document.querySelector("#spline-canvas"));

    LagrangeDemoGraph.SetFunctionSlot((x)=>{ return 0.5*x*x - 0.5*x + 1; },"Demo")
    LagrangeDemoGraph.SetInteractable(false);
    LagrangeDemoGraph.DrawGrid(1, 0.5);
    LagrangeDemoGraph.DrawFunction("Demo", 1);

    COGDemoGraph.SetInteractable(false);
    COGDemoGraph.DrawGrid(1, 0.5);
    
    SplineDemoGraph.SetInteractable(false);
    SplineDemoGraph.SetFunctionSlot((x)=>
    { 
        if(x < 0){ return 0; }
        else if(x < 1){ return 0.5*x + 0.5*x*x*x; }
        else if(x < 2){ return 1 + 2*(x-1) + 1.5*(x-1)*(x-1) - 0.5*(x-1)*(x-1)*(x-1); }
        else{ return 0; }
    },"Demo");
    SplineDemoGraph.DrawGrid(1, 0.5);
    SplineDemoGraph.DrawFunction("Demo", 1);

})();