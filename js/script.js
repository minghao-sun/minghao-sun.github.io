d3.csv('data/nutrition.csv').then(data => {
    // Convert data to numeric values where appropriate
    data.forEach(d => {
        d.calories = parseFloat(d.calories);
        d.serving_size = parseFloat(d.serving_size);
        d.total_fat = parseFloat(d.total_fat);
        d.protein = parseFloat(d.protein);
        d.carbohydrate = parseFloat(d.carbohydrate);
        d.fiber = parseFloat(d.fiber);
        d.sugars = parseFloat(d.sugars);
    });

    console.log("Data loaded:", data); // Debugging line

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

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.serving_size)])
            .range([50, 750]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.calories)])
            .range([550, 50]);

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => x(d.serving_size))
            .attr("cy", d => y(d.calories))
            .attr("r", 5)
            .style("fill", "steelblue");

        svg.append("text")
            .attr("x", 400)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Calories vs Serving Size");

        // Annotations
        const highestCalorieFood = data.reduce((max, d) => d.calories > max.calories ? d : max, data[0]);
        svg.append("text")
            .attr("x", x(highestCalorieFood.serving_size))
            .attr("y", y(highestCalorieFood.calories) - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "red")
            .text(`Highest Calorie Food: ${highestCalorieFood.name}`);
    }

    function scene2(data) {
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const selectedFoodName = d3.select("#food-select").property("value");
        const selectedFood = data.find(d => d.name === selectedFoodName);

        const nutrientKeys = ["protein", "total_fat", "carbohydrate", "fiber", "sugars"];
        const nutrientValues = nutrientKeys.map(key => parseFloat(selectedFood[key]));

        console.log("Selected Food:", selectedFood); // Debugging line
        console.log("Nutrient Values:", nutrientValues); // Debugging line

        const radarScale = d3.scaleLinear()
            .domain([0, d3.max(nutrientValues)])
            .range([0, 200]);

        const radarLine = d3.lineRadial()
            .angle((d, i) => i * 2 * Math.PI / nutrientKeys.length)
            .radius(d => radarScale(d));

        svg.append("g")
            .attr("transform", "translate(400,300)")
            .append("path")
            .datum(nutrientValues)
            .attr("d", radarLine)
            .style("fill", "steelblue")
            .style("opacity", 0.5);

        nutrientKeys.forEach((key, i) => {
            const angle = i * 2 * Math.PI / nutrientKeys.length;
            svg.append("text")
                .attr("x", 400 + Math.cos(angle) * 220)
                .attr("y", 300 + Math.sin(angle) * 220)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text(key);
        });

        svg.append("text")
            .attr("x", 400)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text(`Nutritional Breakdown: ${selectedFood.name}`);
    }

    function scene3(data) {
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const comparisonFoods = [data[1], data[2]]; // Example: Select two food items for comparison

        const nutrientKeys = ["protein", "total_fat", "carbohydrate", "fiber", "sugars"];
        const maxValues = nutrientKeys.map(key => d3.max(comparisonFoods, d => parseFloat(d[key])));

        const x0 = d3.scaleBand()
            .domain(nutrientKeys)
            .rangeRound([100, 700])
            .paddingInner(0.1);

        const x1 = d3.scaleBand()
            .domain(comparisonFoods.map(d => d.name))
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(maxValues)])
            .range([550, 50]);

        svg.append("g")
            .selectAll("g")
            .data(comparisonFoods)
            .enter().append("g")
            .attr("transform", d => `translate(${x1(d.name)},0)`)
            .selectAll("rect")
            .data(d => nutrientKeys.map(key => ({ key, value: parseFloat(d[key]) })))
            .enter().append("rect")
            .attr("x", d => x0(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => 550 - y(d.value))
            .style("fill", (d, i) => i % 2 === 0 ? "steelblue" : "orange");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,550)")
            .call(d3.axisBottom(x0));

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(100,0)")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", 400)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Comparison of Nutritional Content");
    }

    // Initialize the first scene
    updateScene();
});
