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

      // Set data used for circles.
      let circlesGroup = chartGroup.selectAll("circle").data(demoData);
      // Bind data.
      let elemEnter = circlesGroup.enter();
      // Create circles.
      let circle = elemEnter
        .append("circle")
        .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
        .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);
      // Create circle text.
      let circleText = elemEnter
        .append("text")
        .attr("x", (d) => xLinearScale(d[chosenXAxis]))
        .attr("y", (d) => yLinearScale(d[chosenYAxis]))
        .attr("dy", ".35em")
        .text((d) => d.abbr)
        .classed("stateText", true);
      
    // Update tool tip function above csv import.
      let circlesGroup = updateToolTip(
        chosenXAxis,
        chosenYAxis,
        circle,
        circleText
      );
      // Add x label groups and labels.
      var xLabelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
      var povertyLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
      var ageLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
      var incomeLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
      