// @TODO: YOUR CODE HERE!

const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initital Params
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// function used for updating x-scale var upon click on axis label
function xScale(acsData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(acsData, d => d[chosenXAxis]), // * 0.8,
        d3.max(acsData, d => d[chosenXAxis]), // * 1.2
      ])
      .range([0, chartWidth]);
  
    return xLinearScale;
  
}

// function used for updating y-scale var upon click on axis label
function yScale(acsData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(acsData, d => d[chosenYAxis]),
            d3.max(acsData, d => d[chosenYAxis]),
        ])
        .range([chartHeight, 0]);
    
    return yLinearScale;
}


d3.csv('assets/data/data.csv').then(function(acsData, err) {
    if (err) throw err;

    acsData.forEach(function(data) {
        // x-axis
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        // y-axis
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // ------- AXES --------
    // Create x & y scale functions
    var xLinearScale = xScale(acsData, chosenXAxis);
    var yLinearScale = yScale(acsData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    // ------ CIRCLES --------
    // Append initital circles w/ text
    // Create main group for circles and a group cor each circle
    var circlesGroup = chartGroup.selectAll("circle")
        .data(acsData)
        .enter()
        .append("g");

    // Populate chart with circles
    var circle = circlesGroup
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "green")
        .attr("opacity", ".5");

    // Add abbreviation labels
    var circleText = circlesGroup
        .append("text")
        .text( d => d.abbr);

    // get bounding box of text for centering
    var bb = circleText.node()
        .getBBox();

    // center text to each circle
    circleText
        .attr("dx", d => xLinearScale(d[chosenXAxis]) - (bb.width / 2))
        .attr("dy", d => yLinearScale(d[chosenYAxis]) + (bb.height / 4))

})