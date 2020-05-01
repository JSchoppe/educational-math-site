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
    //#region Navigation Animation
    (function()
    {
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
        // Define the behavior where the nav tabs will light up as they are passed.
        // Note: this behavior is broken when there are not enough pages in each section.
        const onTabsUpdate = function()
        {
            // The Y coordinate half way down the viewport(assumed region of focus).
            const halfHeight = window.innerHeight * 0.5;
            // Find the furthest section of tools whose start-point is scrolled past the halfway point.
            let activeIndex;
            for(activeIndex = 0; activeIndex < tabSplitElements.length; activeIndex++)
            {
                if((tabSplitElements[activeIndex].getBoundingClientRect()).top > halfHeight)
                    break;
            }
            activeIndex--;
            // Trigger the CSS states via class.
            for(let i = 0; i < tabSplitElements.length; i++)
            {
                if(i === activeIndex)
                    tabSplitTabs[i].classList.add("label-active");
                else
                    tabSplitTabs[i].classList.remove("label-active");
            }
        };
        // Bind to events that may change the layout size.
        CORE.CALL_ON_PAGE_SCROLL(onTabsUpdate);
        CORE.CALL_ON_RESIZE(onTabsUpdate);
    })();
    //#endregion

    //#region Graph Scaling Fix (Desktop)
    // This needs to be placed before before the graph instantiation
    // so that it is called first in call on resize.
    (function()
    {
        const graphDivs = document.querySelectorAll(".tool-preview-wrapper");
        const ioDivs = document.querySelectorAll(".input-output-wrapper");

        CORE.CALL_ON_RESIZE(()=>
        {
            for(let i = 0; i < graphDivs.length; i++)
            {
                const size = ioDivs[i].getBoundingClientRect().bottom - graphDivs[i].getBoundingClientRect().top
                graphDivs[i].style.height = size + "px";
            }
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
        Graph.DrawObject("grid", 2, ()=>
        {
            {
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
    (document.querySelectorAll(".tool-info-wrapper")).forEach((element) =>
    {
        CORE.CALL_ON_ELEMENT_SCROLL_IN(element, ()=>
        {
            element.classList.remove("panned-offscreen");
        }, "Y");
        CORE.CALL_ON_ELEMENT_SCROLL_OUT(element, ()=>
        {
            element.classList.add("panned-offscreen");
        }, "Y");
    });
    //#endregion
})();