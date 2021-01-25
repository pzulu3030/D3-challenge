//SVG params.
let svgHeight = window.innerHeight / 1.2;
let svgWidth = window.innerWidth / 1.7;
// Margins.
let margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 80,
};

// Chart area minus margins.
let chartHeight = svgHeight - margin.top - margin.bottom;
let chartWidth = svgWidth - margin.left - margin.right;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Read csv file
 d3.csv("assets/data/data.csv")
    .then(function (demoData, err) {
      if (err) throw err;
      // Parse data.
      demoData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = data.obesity;
      });

// Create x/y linear scales.
let xLinearScale = xScale(demoData, chosenXAxis, chartWidth);
let yLinearScale = yScale(demoData, chosenYAxis, chartHeight);
// Append x axis.
let xAxis = chartGroup
.append("g")
.attr("transform", `translate(0, ${chartHeight})`)
.call(bottomAxis);
// Append y axis.
let yAxis = chartGroup.append("g").call(leftAxis);