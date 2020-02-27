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
    LagrangeDemoGraph.SetInteractable(false);
    LagrangeDemoGraph.DrawGrid(1, 0.5);
    

})();