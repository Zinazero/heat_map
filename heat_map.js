// Fetching data from the provided URL
fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => response.json()) // Parsing the response as JSON
    .then((data) => {
      const parseMonth = d3.timeParse("%m"); // Creating a date parsing function using d3.timeParse
  
      // Extracting the necessary data from the fetched JSON data
      const months = data.monthlyVariance.map((d) => parseMonth(d.month));
      const years = data.monthlyVariance.map((d) => d.year);
      const temps = data.monthlyVariance.map(
        (d) => Math.round((8.66 - d.variance) * 10) / 10
      );
  
      // Creating a tooltip element
      const tooltip = d3
        .select("#graphContainer")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
  
      const w = 1500; // Width of the SVG container
      const h = 600; // Height of the SVG container
      const padding = 60; // Padding for the visualization within the SVG container
  
      // Creating scales for the x and y axes
      const xScale = d3
        .scaleLinear()
        .domain([1753, 2015]) // Setting the domain of x-axis from 1753 to 2015
        .range([padding, w - padding]); // Setting the range of x-axis from padding to (w - padding)
  
      const yScale = d3
        .scalePoint()
        .domain(months) // Setting the domain of y-axis as the months
        .range([h - padding, padding]) // Setting the range of y-axis from (h - padding) to padding
        .padding(0.5); // Setting the padding between points on the y-axis
  
      // Creating the SVG element
      const svg = d3
        .select("#graphContainer")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
  
      // Adding rectangles to the SVG based on the data
      svg
        .selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.year)) // Setting the x-coordinate of the rectangle
        .attr("y", (_, i) => yScale(months[i]) - yScale.step() / 2) // Setting the y-coordinate of the rectangle
        .attr("height", yScale.step()) // Setting the height of the rectangle based on the y-scale
        .attr("width", xScale(1754) - xScale(1753)) // Setting the width of the rectangle based on the x-scale
        .attr("class", "cell") // Adding a class to the rectangle for styling
        .attr("data-year", (d) => d.year) // Storing the year as a data attribute
        .attr("data-month", (d) => d.month - 1) // Storing the month as a data attribute
        .attr("data-temp", (d) => 8.66 - d.variance) // Storing the temperature as a data attribute
        .attr("fill", function (d) {
          // Setting the fill color of the rectangle based on the temperature
          var temperature = 8.66 - d.variance;
          if (temperature < 2.8) {
            return "#1A237E";
          } else if (temperature >= 2.8 && temperature < 3.9) {
            return "#0D47A1";
          } else if (temperature >= 3.9 && temperature < 5.0) {
            return "#1976D2";
          } else if (temperature >= 5.0 && temperature < 6.1) {
            return "#29B6F6";
          } else if (temperature >= 6.1 && temperature < 7.2) {
            return "#B3E5FC";
          } else if (temperature >= 7.2 && temperature < 8.3) {
            return "#FFF59D";
          } else if (temperature >= 8.3 && temperature < 9.5) {
            return "#FFD54F";
          } else if (temperature >= 9.5 && temperature < 10.6) {
            return "#FFA000";
          } else if (temperature >= 10.6 && temperature < 11.7) {
            return "#E65100";
          } else if (temperature >= 11.7 && temperature < 12.8) {
            return "#B71C1C";
          } else if (temperature >= 12.8) {
            return "#3E2723";
          }
        })
        .on("mouseover", function (event, d) {
          // Handling the mouseover event for the rectangle
          d3.select(this).attr("stroke", "black"); // Adding a black stroke to the rectangle
          tooltip.transition().duration(100).style("opacity", 0.9); // Making the tooltip visible
  
          tooltip
            .html(
              d.year +
                "<br>" +
                `${Math.round((8.66 - d.variance) * 10) / 10}` +
                "℃" +
                "<br>" +
                d.variance
            )
            .style("left", `${event.pageX + 10}px`) // Positioning the tooltip next to the mouse cursor
            .style("top", `${event.pageY - 50}px`)
            .attr("data-year", d.year);
        })
        .on("mouseout", (d) => {
          // Handling the mouseout event for the rectangle
          d3.selectAll("rect").attr("stroke", null); // Removing the stroke from all rectangles
          tooltip.transition().duration(100).style("opacity", 0); // Hiding the tooltip
        });
  
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.format("d")) // Formatting the tick values as integers
        .tickValues(d3.range(1760, 2015, 10)); // Setting the tick values for the x-axis
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")); // Formatting the tick values as month names
  
      // Adding x-axis to the SVG
      svg
        .append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)
        .attr("id", "x-axis");
  
      // Adding y-axis to the SVG
      svg
        .append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)
        .attr("id", "y-axis");
  
      const legendScale = d3.scaleLinear().domain([1.7, 13.9]).range([0, 500]); // Creating a scale for the legend
      const legendAxis = d3
        .axisBottom(legendScale)
        .tickFormat(d3.format(".1f")) // Formatting the tick values with one decimal place
        .tickValues(d3.range(2.8, 12.8, 1.109)); // Setting the tick values for the legend
      const legendData = [
        { temp: 2.8, color: "#0D47A1" },
        { temp: 3.9, color: "#1976D2" },
        { temp: 5.0, color: "#29B6F6" },
        { temp: 6.1, color: "#B3E5FC" },
        { temp: 7.2, color: "#FFF59D" },
        { temp: 8.32, color: "#FFD54F" },
        { temp: 9.46, color: "#FFA000" },
        { temp: 10.6, color: "#E65100" },
        { temp: 11.7, color: "#B71C1C" }
      ]; // Data for the legend
  
      // Creating the legend SVG element
      const legendSvg = d3
        .select("#graphContainer")
        .append("svg")
        .attr("width", 600)
        .attr("height", 80)
        .attr("id", "legend");
  
      // Adding the legend axis to the legend SVG
      legendSvg
        .append("g")
        .attr("transform", "translate(" + padding + ", 30)")
        .call(legendAxis)
        .attr("id", "legend-axis");
  
      // Adding rectangles to the legend SVG based on the data
      legendSvg
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d) => legendScale(d.temp) + padding) // Setting the x-coordinate of the rectangle
        .attr("y", 0) // Setting the y-coordinate of the rectangle
        .attr("height", 30) // Setting the height of the rectangle
        .attr("width", 45) // Setting the width of the rectangle
        .attr("fill", (d) => d.color) // Setting the fill color of the rectangle
        .attr("class", "legend-rect"); // Adding a class to the rectangle for styling
    });
  