import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TradeoffChart({ metrics, isHovered = false }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!metrics) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 150;
    const height = 150;
    const radius = Math.min(width, height) / 2 - 20;

    const data = [
      { axis: "Cost Efficiency", value: metrics.cost },
      { axis: "Scalability", value: metrics.scalability },
      { axis: "Operational Effort", value: metrics.ops }
    ];

    const maxValue = 10;
    const angleSlice = (Math.PI * 2) / data.length;

    // Scales
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("font-size", "12px");

    // Draw grid circles
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      svg.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", levelRadius)
        .style("fill", "none")
        .style("stroke", "#CDCDCD")
        .style("stroke-width", "1px");
    }

    // Draw axes
    const axis = svg.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2)
      .attr("x2", (d, i) => width / 2 + rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => height / 2 + rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "#CDCDCD")
      .style("stroke-width", "1px");

    // Draw area
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .style("fill", isHovered ? "rgba(255, 99, 132, 0.3)" : "rgba(54, 162, 235, 0.3)")
      .style("stroke", isHovered ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)")
      .style("stroke-width", isHovered ? "3px" : "2px");

    // Draw points
    svg.selectAll(".radar-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("cx", (d, i) => width / 2 + rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => height / 2 + rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("r", 4)
      .style("fill", isHovered ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)")
      .style("stroke", "#fff")
      .style("stroke-width", "2px")
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(200).attr("r", 6);
        tooltip.style("visibility", "visible")
          .text(`${d.axis}: ${d.value}/10`);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(200).attr("r", 4);
        tooltip.style("visibility", "hidden");
      });

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [metrics, isHovered]);

  return (
    <div style={{ width: '150px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg ref={svgRef} width="150" height="150"></svg>
    </div>
  );
}
