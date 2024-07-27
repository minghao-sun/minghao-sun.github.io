// Set up the scenes and parameters
const scenes = [
    { id: 'scene1', title: 'Scene 1', data: 'data/scene1.json' },
    { id: 'scene2', title: 'Scene 2', data: 'data/scene2.json' },
    { id: 'scene3', title: 'Scene 3', data: 'data/scene3.json' }
];

// Parameters and state variables
let currentScene = scenes[0];

// Initialize the visualization
function init() {
    d3.select('#scene1').on('click', () => loadScene(scenes[0]));
    d3.select('#scene2').on('click', () => loadScene(scenes[1]));
    d3.select('#scene3').on('click', () => loadScene(scenes[2]));

    loadScene(currentScene);
}

// Load a scene
function loadScene(scene) {
    d3.json(scene.data).then(data => {
        updateVisualization(data);
    });
}

// Update the visualization
function updateVisualization(data) {
    const svg = d3.select('#visualization')
        .html('') // Clear previous content
        .append('svg')
        .attr('width', 800)
        .attr('height', 600);

    // Example of visualizing data as circles (you can customize this)
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => 600 - d.y) // Invert y for better visual representation
        .attr('r', d => d.value)
        .attr('fill', 'steelblue');

    // Example annotation (you can customize this)
    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => 600 - d.y - 10) // Place text above the circle
        .text(d => `${d.name}: ${d.value}`);
}

// Initialize the visualization on page load
init();
