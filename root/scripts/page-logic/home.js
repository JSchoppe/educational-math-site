// Define local page behavior for the homepage.
(function()
{
    //#region Navigation Interaction
    (function()
    {
        // Get page references.
        const nav = document.querySelector("nav");
        const navPullTab = document.querySelector("#nav-pull-tab");
        const navLabels = document.querySelectorAll(".category-label");
    
        // When the mobile user clicks the hamburger menu,
        // collapse or uncollapse the menu.
        navPullTab.addEventListener("click", ()=>
        {
            nav.classList.toggle("mobile-collapsed");
        });
        // When any label is clicked, the mobile menu is collapsed.
        navLabels.forEach((element) =>
        {
            element.addEventListener("click", ()=>
            {
                nav.classList.add("mobile-collapsed");
            });
        });
    })();
    //#endregion

    //#region Center of Gravity Demo
    (function()
    {
        // Get the graph to output to.
        const Graph = new GraphOutput(document.querySelector("#center-of-gravity-canvas"));
        // Create the demo animation for center of gravity.
        Graph.SetInteractable(true);
        Graph.AddDrawCommand(new GridDrawer(1, 4), "grid");
        Graph.AddDrawCommand(new FunctionDrawer((x)=>{ return Math.sin(x); }), "sin");
        Graph.DrawObject("grid", 2, ()=>
        {
            Graph.DrawObject("sin", 2, ()=>
            {
                Graph.EraseObject("sin", 2);
            });
        });
    }());
    //#endregion
    //#region Bezier Curve Demo
    (function()
    {
        // Get the graph to output to.
        const Graph = new GraphOutput(document.querySelector("#bezier-canvas"));
        // Create the demo animation for bezier curves.
        Graph.AddDrawCommand(new GridDrawer(1, 4), "grid");
        Graph.DrawObject("grid");
    }());
    //#endregion
    //#region Lagrange Polynomial Demo
    (function()
    {
        // Get the graph to output to.
        const Graph = new GraphOutput(document.querySelector("#lagrange-canvas"));
        // Create the demo animation for lagrange polynomials.
        Graph.AddDrawCommand(new FunctionDrawer((x)=>{ return 0.5*x*x - 0.5*x + 1; }), "lagrange");
        Graph.AddDrawCommand(new GridDrawer(1, 4), "grid");
        Graph.DrawObject("grid", 2, ()=>
        {
            Graph.DrawObject("lagrange", 2);
        });
        Graph.SetInteractable(false);
        Graph.WindowToBoundingBox(-1, 4, 0, 5, 3);
    }());
    //#endregion
    //#region Spline Demo
    (function()
    {
        // Get the graph to output to.
        const Graph = new GraphOutput(document.querySelector("#spline-canvas"));
        // Create the demo animation for splines.
        Graph.SetInteractable(false);
        Graph.AddDrawCommand(new FunctionDrawer((x)=>
        {
            if(x < 0){ return undefined; }
            else if(x < 1){ return 0.5*x + 0.5*x*x*x; }
            else if(x < 2){ return 1 + 2*(x-1) + 1.5*(x-1)*(x-1) - 0.5*(x-1)*(x-1)*(x-1); }
            else{ return undefined; }
        }), "spline");
        Graph.AddDrawCommand(new GridDrawer(1, 4), "grid");

        Graph.DrawObject("grid", 2, ()=>
        {
            Graph.DrawObject("spline", 2);
        });
    })();
    //#endregion

    //#region Scroll Effects
    (document.querySelectorAll(".input-panel")).forEach((element) =>
    {
        CORE.CALL_ON_ELEMENT_SCROLL_IN(element, ()=>
        {
            element.classList.remove("panel-hidden");
        });
        CORE.CALL_ON_ELEMENT_SCROLL_OUT(element, ()=>
        {
            element.classList.add("panel-hidden");
        });
    });
    (document.querySelectorAll(".output-panel")).forEach((element) =>
    {
        CORE.CALL_ON_ELEMENT_SCROLL_IN(element, ()=>
        {
            element.classList.remove("panel-hidden");
        });
        CORE.CALL_ON_ELEMENT_SCROLL_OUT(element, ()=>
        {
            element.classList.add("panel-hidden");
        });
    });
    //#endregion



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
        
        // Determine how
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