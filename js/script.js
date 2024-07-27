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
        d.irom = +d.irom;
    });

    // Global settings
    const svg = d3.select("#visualization").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const update = (sceneFunction) => {
        svg.selectAll("*").remove(); // Clear previous contents
        sceneFunction();
    };

    // Scene functions
    function scene1() {
        // Calorie comparison chart
        const x = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([50, 750])
            .padding(0.2);
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.calories)])
            .range([550, 50]);
        
        svg.append("g")
            .attr("transform", "translate(0,550)")
            .call(d3.axisBottom(x).tickFormat(d => d.substring(0, 10) + "..."))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

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

    function scene2() {
        // Dropdown for food selection
        const select = d3.select("body").append("select")
            .attr("id", "foodSelect")
            .on("change", function() {
                updateNutritionalBreakdown(this.value);
            });
        
        select.selectAll("option")
            .data(data)
            .enter().append("option")
            .text(d => d.name)
            .attr("value", d => d.name);

        function updateNutritionalBreakdown(foodName) {
            const selectedFood = data.find(d => d.name === foodName);
            const nutrients = ["protein", "total_fat", "carbohydrate", "fiber", "sugars"];
            const values = nutrients.map(n => selectedFood[n]);

            const radarChart = RadarChart(svg, [values], {
                w: 600, h: 600, levels: 5, roundStrokes: true,
                color: d3.scaleOrdinal().range(["#AFC52F", "#2C93E8"]),
                format: '.2f',
                legend: { title: 'Nutritional Breakdown', translateX: 120, translateY: 40 },
                unit: 'g'
            });

            svg.selectAll(".radarWrapper .radarStroke")
                .data(values)
                .attr("d", radarChart.update);
        }

        updateNutritionalBreakdown(data[0].name);  // Initialize with first food
    }

    function scene3() {
        // Similar to scene 2 but focusing on vitamins and minerals
        const select = d3.select("body").append("select")
            .attr("id", "foodSelectMinerals")
            .on("change", function() {
                updateMineralContent(this.value);
            });
        
        select.selectAll("option")
            .data(data)
            .enter().append("option")
            .text(d => d.name)
            .attr("value", d => d.name);

        function updateMineralContent(foodName) {
            const selectedFood = data.find(d => d.name === foodName);
            const nutrients = ["calcium", "copper", "irom"];
            const values = nutrients.map(n => selectedFood[n]);

            // Visualization logic similar to scene2 for these minerals
        }

        updateMineralContent(data[0].name);  // Initialize with first food
    }

    // Initial scene setup
    update(scene1);  // Start with the first scene

    // Navigation setup
    d3.select("#next").on("click", () => {
        let nextScene = (currentScene + 1) % scenes.length;
        update(scenes[nextScene]);
    });
    d3.select("#prev").on("click", () => {
        let prevScene = (currentScene - 1 + scenes.length) % scenes.length;
        update(scenes[prevScene]);
    });
});
