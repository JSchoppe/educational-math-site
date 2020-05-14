// Define local page behavior for the lagrange polynomial.
(function()
{

    const settingsButton = document.querySelector("#settings-tab");
    const settingsContent = document.querySelector("#settings-content");
    const formulasButton = document.querySelector("#formulas-tab");
    const formulasContent = document.querySelector("#formulas-content");


    let inSettings = false;
    let inFormulas = false;
    settingsButton.addEventListener("click", ()=>
    {
        inSettings = !inSettings;
        if(inFormulas)
        {
            formulasContent.classList.add("hidden");
            inFormulas = false;
        }
        settingsContent.classList.toggle("hidden");

        // Since revealing or hiding the menu changes the graph size:
        CORE.CALL_RESIZE();
    });
    formulasButton.addEventListener("click", ()=>
    {
        inFormulas = !inFormulas;
        if(inSettings)
        {
            settingsContent.classList.add("hidden");
            inSettings = false;
        }
        formulasContent.classList.toggle("hidden");

        // Since revealing or hiding the menu changes the graph size:
        CORE.CALL_RESIZE();
    });

    //#region Get Page References
    const canvas = document.querySelector("canvas");
    //#endregion


    // Draw the default graph.
    const Graph = new GraphOutput(canvas);
    Graph.AddDrawCommand(new GridDrawer(1, 4), "grid");
    Graph.DrawObject("grid");

    const dataPointHTML = document.getElementById("vector2-template").outerHTML;
    const dataPointsDiv = document.querySelector(".datapoint-set");
    const addButton = document.querySelector(".add-datapoint-button");
    const removeButton = document.querySelector(".remove-datapoint-button");
    
    const minimumDataPoints = 2;
    let dataPointCount = dataPointsDiv.children.length;

    addButton.addEventListener("click", ()=>{
        dataPointCount++;
        dataPointsDiv.innerHTML += dataPointHTML.replace(/1/g, dataPointCount);
    });

    removeButton.addEventListener("click", ()=>{
        if(dataPointCount > minimumDataPoints)
        {
            dataPointCount--;

            let index = dataPointsDiv.children.length - 1;
            dataPointsDiv.children.item(index).remove();
        }
    });


    const generateLagrangeFunction = function(dataPoints)
    {
        let coefficients = [];
        let shifts = [[]];

        for(let i = 0; i < dataPoints.length; i++)
        {
            coefficients.push(dataPoints[i].y);
            shifts.push([]);
            for(let j = 0; j < dataPoints.length; j++)
            {
                if(j != i)
                {
                    coefficients[i] /= dataPoints[i].x - dataPoints[j].x;
                    shifts[i].push(-dataPoints[j].x);
                }
            }
        }

        let generatedFunction = function(x)
        {
            let accumulator = 0;
            for(let i = 0; i < coefficients.length; i++)
            {
                let term = coefficients[i];
                for(let j = 0; j < shifts[i].length; j++)
                {
                    term *= x + shifts[i][j];
                }
                accumulator += term;
            }
            return accumulator;
        };

        return generatedFunction;
    };


    const checkData = function()
    {
        let xData = [];
        let yData = [];
        for(let i = 1; i <= dataPointCount; i++)
        {
            let xValue = document.getElementById("x" + i).value;
            let yValue = document.getElementById("y" + i).value;

            xData.push(xValue);
            for(let j = xData.length - 2; j >= 0; j--)
            {
                if(xData[j] == xValue)
                {
                    console.log("same!!!");
                    return;
                }
            }
            yData.push(yValue);

            let data = [];
            for(let k = 0; k < xData.length; k++)
            {
                data.push({x: xData[k], y: yData[k]});
            }
            let L = generateLagrangeFunction(data);

            Graph.AddDrawCommand(new FunctionDrawer(L), "Lagrange");
            Graph.DrawObject("Lagrange", 2);
        }
    };

    for(let i = 1; i <= 3; i++)
    {
        document.getElementById("x" + i).addEventListener("input", checkData);
        document.getElementById("y" + i).addEventListener("input", checkData);
    }

})();