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
    let BezierDemoGraph = new GraphOutput(document.querySelector("#bezier-canvas"));

    LagrangeDemoGraph.SetFunctionSlot((x)=>{ return 0.5*x*x - 0.5*x + 1; },"Demo")
    LagrangeDemoGraph.SetInteractable(false);
    LagrangeDemoGraph.WindowToBoundingBox(-1, 4, 0, 5, 3);
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
    SplineDemoGraph.DrawFunction("Demo", 3);
    
    BezierDemoGraph.DrawGrid(1, 0.5);

    // Pull references for the dynamically restyling tabs.
    const tabSplitElements = [
        document.querySelector("#geometry-start"),
        document.querySelector("#rendering-start"),
        document.querySelector("#numerical-start")
    ];
    const tabSplitTabs = [
        document.querySelector("#geometry-tab"),
        document.querySelector("#rendering-tab"),
        document.querySelector("#numerical-tab")
    ];

    // TODO: REFACTOR
    // Define the behavior where the nav tabs will light up as they are passed.
    CORE.CALL_ON_PAGE_SCROLL(()=>
    {
        let halfHeight = window.innerHeight * 0.5;
        
        // Determine the farthest content split that is above 50vh.
        for(let i = 0; i < tabSplitElements.length; i++)
        {
            let top = (tabSplitElements[i].getBoundingClientRect()).top;
            if(top < halfHeight)
            {
                tabSplitTabs[i].classList.add("label-active");
                if(i !== 0)
                {
                    tabSplitTabs[i - 1].classList.remove("label-active");
                }
                hasPassedActive = true;
            }
            else
            {
                tabSplitTabs[i].classList.remove("label-active");
            }
        }
    });

})();