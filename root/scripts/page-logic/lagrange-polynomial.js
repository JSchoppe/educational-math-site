// Define local page behavior for the lagrange polynomial.
(function()
{
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    context.beginPath();
    context.rect(-50, -50, 150, 100);
    context.fillStyle = "red";
    context.fill();
})();