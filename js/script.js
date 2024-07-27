d3.csv('data/nutrition.csv').then(data => {
    // Convert data to numeric values where necessary
    data.forEach(d => {
        d.calories = +d.calories;
        d.protein = +d.protein;
        d.sugars = +d.sugars;
        d.total_fat = +d.total_fat;
        d.carbohydrate = +d.carbohydrate;
        d.fiber = +d.fiber;
        d.calcium = +d.calcium;
        d.copper = +d.copper;
        d.iron = +d.irom;  // Assuming typo in the original CSV
    });

    let currentScene = 0;
    const scenes = [scene1, scene2, scene3];

    // Populate dropdown with food names
    const foodSelect = d3.select("#food-select");
    foodSelect.selectAll("option")
        .data(data)
        .enter().append("option")
        .attr("value", d => d.name)
        .text(d => d.name);

    d3.select("#next").on("click", () => {
        currentScene = (currentScene + 1) % scenes.length;
        updateScene();
    });

    d3.select("#prev").on("click", () => {
        currentScene = (currentScene - 1 + scenes.length) % scenes.length;
        updateScene();
    });

    function updateScene() {
        d3.select("#visualization").html("");
        scenes[currentScene](data);
    }

    function scene1(data) {
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const x = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([50, 750])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.calories)])
            .range([550, 50]);

        svg.append("g")
            .attr("transform", "translate(0,550)")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", "translate(50,0)")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.calories))
            .attr("width", x.bandwidth())
            .attr("height", d => 550 - y(d.calories))
            .attr("fill", "steelblue")
            .append("title")
            .text(d => `${d.name}: ${d.calories} calories`);

        svg.append("text")
            .attr("x", 400)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Calorie Comparison Among Foods");
    }

    function scene2(data) {
        const selectedFoodName = d3.select("#food-select").property("value");
        const selectedFood = data.find(d => d.name === selectedFoodName);

        const nutrients = ["protein", "total_fat", "carbohydrate", "fiber", "sugars"];
        const values = nutrients.map(n => selectedFood[n]);

        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const x = d3.scaleBand()
            .domain(nutrients)
            .range([100, 700])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .range([550, 50]);

        svg.append("g")
            .attr("transform", "translate(0,550)")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", "translate(100,0)")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(values)
            .enter().append("rect")
            .attr("x", (d, i) => x(nutrients[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => 550 - y(d))
            .attr("fill", "steelblue")
            .append("title")
            .text((d, i) => `${nutrients[i]}: ${d} g`);

        svg.append("text")
            .attr("x", 400)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text(`Nutritional Breakdown: ${selectedFood.name}`);
    }

    function scene3(data) {
        const selectedFoodName = d3.select("#food-select").property("value");
        const selectedFood = data.find(d => d.name === selectedFoodName);

        const nutrients = ["calcium", "copper", "iron"];
        const values = nutrients.map(n => selectedFood[n]);

        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const x = d3.scaleBand()
            .domain(nutrients)
            .range([100, 700])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .range([550, 50]);

        svg.append("g")
            .attr("transform", "translate(0,550)")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", "translate(100,0)")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(values)
            .enter().append("rect")
            .attr("x", (d, i) => x(nutrients[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => 550 - y(d))
            .attr("fill", "steelblue")
            .append("title")
            .text((d, i) => `${nutrients[i]}: ${d} mg`);

        svg.append("text")
            .attr("x", 400)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text(`Vitamin and Mineral Content: ${selectedFood.name}`);
    }

    // Initialize the first scene
    updateScene();
});
