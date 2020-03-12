// Define local page behavior for the homepage.
(function()
{
    //#region Navigation Interaction
    (function()
    {
        // Get page references.
        let nav = document.querySelector("nav");
        let navPullTab = document.querySelector("#nav-pull-tab");
        let navLabels = document.querySelectorAll(".category-label");
    
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
        let Graph = new GraphOutput(document.querySelector("#center-of-gravity-canvas"));
        // Create the demo animation for center of gravity.
        Graph.SetInteractable(false);
        Graph.DrawGrid(1, 0.5);
    }());
    //#endregion
    //#region Bezier Curve Demo
    (function()
    {
        // Get the graph to output to.
        let Graph = new GraphOutput(document.querySelector("#bezier-canvas"));
        // Create the demo animation for bezier curves.
        Graph.DrawGrid(1, 0.5);
    }());
    //#endregion
    //#region Lagrange Polynomial Demo
    (function()
    {
        // Get the graph to output to.
        let Graph = new GraphOutput(document.querySelector("#lagrange-canvas"));
        // Create the demo animation for lagrange polynomials.
        Graph.SetFunctionSlot((x)=>{ return 0.5*x*x - 0.5*x + 1; },"Demo")
        Graph.SetInteractable(false);
        Graph.WindowToBoundingBox(-1, 4, 0, 5, 3);
        Graph.DrawGrid(1, 0.5);
        Graph.DrawFunction("Demo", 1);
    }());
    //#endregion
    //#region Spline Demo
    (function()
    {
        // Get the graph to output to.
        let Graph = new GraphOutput(document.querySelector("#spline-canvas"));
        // Create the demo animation for splines.
        Graph.SetInteractable(false);
        Graph.SetFunctionSlot((x)=>
        {
            if(x < 0){ return 0; }
            else if(x < 1){ return 0.5*x + 0.5*x*x*x; }
            else if(x < 2){ return 1 + 2*(x-1) + 1.5*(x-1)*(x-1) - 0.5*(x-1)*(x-1)*(x-1); }
            else{ return 0; }
        },"Demo");
        Graph.DrawGrid(1, 0.5);
        Graph.DrawFunction("Demo", 3);
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