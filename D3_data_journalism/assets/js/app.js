let selectXAxis = "poverty";
let selectYAxis = "healthcare";
// Function used for updating x-scale var upon click on axis label.
function xScale(data, selectXAxis, chartWidth) {
  // Create scales.
  let xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[selectXAxis]) * 0.8,
      d3.max(data, (d) => d[selectXAxis]) * 1.1,
    ])
    .range([0, chartWidth]);
  return xLinearScale;
}

// Function used for updating y-scale var upon click on axis label.
function yScale(data, selectYAxis, chartHeight) {
  // Create scales.
  let yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[selectYAxis]) * 0.8,
      d3.max(data, (d) => d[selectYAxis]) * 1.2,
    ])
    .range([chartHeight, 0]);
  return yLinearScale;
}

// Function used for updating xAxis var upon click on axis label.
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition().duration(1000).call(bottomAxis);
  return xAxis;
}

// Function used for updating circles group with a transition to new circles.
function renderCircles(
  circlesGroup,
  newXScale,
  newYScale,
  selectXAxis,
  selectYAxis
) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[selectXAxis]))
    .attr("cy", (d) => newYScale(d[selectYAxis]));
  return circlesGroup;
}

// Function used for updating text in circles group with a transition to new text.
function renderText(
  circletextGroup,
  newXScale,
  newYScale,
  selectXAxis,
  selectYAxis
) {
  circletextGroup
    .transition()
    .duration(1000)
    .attr("x", (d) => newXScale(d[selectXAxis]))
    .attr("y", (d) => newYScale(d[selectYAxis]));
  return circletextGroup;
}

// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition().duration(1000).call(leftAxis);
  return yAxis;
}

// Function used for updating circles group with new tooltip.
function updateToolTip(selectXAxis, selectYAxis, circlesGroup, textGroup) {
  // Conditional for X Axis.
  if (selectXAxis === "poverty") {
    var xlabel = "Poverty: ";
  } else if (selectXAxis === "income") {
    var xlabel = "Median Income: ";
  } else {
    var xlabel = "Age: ";
  }
  // Conditional for Y Axis.
  if (selectYAxis === "healthcare") {
    var ylabel = "Lacks Healthcare: ";
  } else if (selectYAxis === "smokes") {
    var ylabel = "Smokers: ";
  } else {
    var ylabel = "Obesity: ";
  }
  // Define tooltip.
  var toolTip = d3
    .tip()
    .offset([120, -60])
    .attr("class", "d3-tip")
    .html(function (d) {
      if (selectXAxis === "age") {
        // All yAxis tooltip labels presented and formated as %.
        // Display Age without format for xAxis.
        return `${d.state}<hr>${xlabel} ${d[selectXAxis]}<br>${ylabel}${d[selectYAxis]}%`;
      } else if (selectXAxis !== "poverty" && selectXAxis !== "age") {
        // Display Income in dollars for xAxis.
        return `${d.state}<hr>${xlabel}$${d[selectXAxis]}<br>${ylabel}${d[selectYAxis]}%`;
      } else {
        // Display Poverty as percentage for xAxis.
        return `${d.state}<hr>${xlabel}${d[selectXAxis]}%<br>${ylabel}${d[selectYAxis]}%`;
      }
    });
  circlesGroup.call(toolTip);
  // Create "mouseover" event listener to display tool tip.
  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data, this);
    })
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });
  textGroup
    .on("mouseover", function (data) {
      toolTip.show(data, this);
    })
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });
  return circlesGroup;
}
function makeResponsive() {
  // Select div by id.
  let svgArea = d3.select("#scatter").select("svg");
  // Clear SVG.
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  //SVG params.
  let svgHeight = window.innerHeight / 1.2;
  let svgWidth = window.innerWidth / 1.7;
  // Margins.
  let margin = {
    top: 50,
    right: 30,
    bottom: 100,
    left: 40,
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
        data.obesity = +data.obesity;
      });
      // Create x/y linear scales.
      let xLinearScale = xScale(demoData, selectXAxis, chartWidth);
      let yLinearScale = yScale(demoData, selectYAxis, chartHeight);
      // Create initial axis functions.
      let bottomAxis = d3.axisBottom(xLinearScale);
      let leftAxis = d3.axisLeft(yLinearScale);
      // Append x axis.
      let xAxis = chartGroup
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
      // Append y axis.
      let yAxis = chartGroup.append("g").call(leftAxis);
      // Set data used for circles.
      var circlesGroup = chartGroup.selectAll("circle").data(demoData);
      // Bind data.
      var elemEnter = circlesGroup.enter();
      // Create circles.
      let circle = elemEnter
        .append("circle")
        .attr("cx", (d) => xLinearScale(d[selectXAxis]))
        .attr("cy", (d) => yLinearScale(d[selectYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);
      // Create circle text.
      let circleText = elemEnter
        .append("text")
        .attr("x", (d) => xLinearScale(d[selectXAxis]))
        .attr("y", (d) => yLinearScale(d[selectYAxis]))
        .attr("dy", ".35em")
        .text((d) => d.abbr)
        .classed("stateText", true);
      // Update tool tip function above csv import.
      var circlesGroup = updateToolTip(
        selectXAxis,
        selectYAxis,
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
      let incomeLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
      // Add y labels group and labels.
      let yLabelsGroup = chartGroup
        .append("g")
        .attr("transform", "rotate(-90)");
      let healthcareLabel = yLabelsGroup
        .append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 40 - margin.left)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
      var smokesLabel = yLabelsGroup
        .append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 20 - margin.left)
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
      var obeseLabel = yLabelsGroup
        .append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");
      // X labels event listener.
      xLabelsGroup.selectAll("text").on("click", function () {
        // Grab selected label.
        selectXAxis = d3.select(this).attr("value");
        // Update xLinearScale.
        xLinearScale = xScale(demoData, selectXAxis, chartWidth);
        // Render xAxis.
        xAxis = renderXAxes(xLinearScale, xAxis);
        // Switch active/inactive labels.
        if (selectXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        } else if (selectXAxis === "age") {
          povertyLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", true).classed("inactive", false);
          incomeLabel.classed("active", false).classed("inactive", true);
        } else {
          povertyLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", true).classed("inactive", false);
        }
        // Update circles with new x values.
        circle = renderCircles(
          circlesGroup,
          xLinearScale,
          yLinearScale,
          selectXAxis,
          selectYAxis
        );
        // Update tool tips with new info.
        circlesGroup = updateToolTip(
          selectXAxis,
          selectYAxis,
          circle,
          circleText
        );
        // Update circles text with new values.
        circleText = renderText(
          circleText,
          xLinearScale,
          yLinearScale,
          selectXAxis,
          selectYAxis
        );
      });
      // Y Labels event listener.
      yLabelsGroup.selectAll("text").on("click", function () {
        // Grab selected label.
        selectYAxis = d3.select(this).attr("value");
        // Update yLinearScale.
        yLinearScale = yScale(demoData, selectYAxis, chartHeight);
        // Update yAxis.
        yAxis = renderYAxes(yLinearScale, yAxis);
        // Changes classes to change bold text.
        if (selectYAxis === "healthcare") {
          healthcareLabel.classed("active", true).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", false).classed("inactive", true);
        } else if (selectYAxis === "smokes") {
          healthcareLabel.classed("active", false).classed("inactive", true);
          smokesLabel.classed("active", true).classed("inactive", false);
          obeseLabel.classed("active", false).classed("inactive", true);
        } else {
          healthcareLabel.classed("active", false).classed("inactive", true);
          smokesLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", true).classed("inactive", false);
        }
        // Update circles with new y values.
        circle = renderCircles(
          circlesGroup,
          xLinearScale,
          yLinearScale,
          selectXAxis,
          selectYAxis
        );
        // Update circles text with new values.
        circleText = renderText(
          circleText,
          xLinearScale,
          yLinearScale,
          selectXAxis,
          selectYAxis
        );
        // Update tool tips with new info.
        circlesGroup = updateToolTip(
          selectXAxis,
          selectYAxis,
          circle,
          circleText
        );
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
