import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./TreeVisualization.css";

const TreeVisualization = ({ treeData }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (treeData) {
      const hierarchyData = transformDataToHierarchy(treeData);
      createVisualization(hierarchyData);

      // handle window resizing
      const handleResize = () => {
        createVisualization(hierarchyData);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [treeData]);

  const transformDataToHierarchy = (data) => {
    // check for missing data
    if (!data || !data.branches) {
      return {
        name: "Skills",
        children: [],
      };
    }

    return {
      name: "Skills",
      children: data.branches.map((branch) => ({
        name: branch.name || "Unnamed Branch",
        children: (branch.twigs || []).map((twig) => ({
          name: twig.name || "Unnamed Twig",
          children: (twig.leaves || []).map((leaf) => ({
            name: leaf.name || "Unnamed Leaf",
          })),
        })),
      })),
    };
  };

  const createVisualization = (data) => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    // clear svg before redrawing
    d3.select(svgRef.current).selectAll("*").remove();

    // create base svg with zoom
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // set up zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // center the view
    const initialTransform = d3.zoomIdentity.translate(margin.left, margin.top);
    svg.call(zoom.transform, initialTransform);

    // set up tree layout
    const treeLayout = d3
      .tree()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right - 200]);

    // create hierarchy and apply layout
    const root = d3.hierarchy(data);
    const treeData = treeLayout(root);

    // draw connecting lines
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", 2);

    // add node groups
    const node = g
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", (d) => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // add circles for nodes
    node
      .append("circle")
      .attr("r", 10)
      .style("fill", "#fff")
      .style("stroke", (d) => {
        // color nodes by level
        if (d.data.name === "Skills") return "#4CAF50";
        if (d.children) return "#2196F3";
        return "#FF9800";
      })
      .style("stroke-width", 3);

    // add text labels
    node
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children ? -13 : 13))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);
  };

  return (
    <div ref={containerRef} className="tree-visualization-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TreeVisualization;
