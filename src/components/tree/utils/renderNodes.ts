import * as d3 from "d3";
import type { HierarchyPointNode } from "d3";
import type { Item } from "../../../types";
import { radialPoint } from "../../../utils";

export function renderNodes(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    nodes: Array<HierarchyPointNode<Item>>
) {
    const nodeGroup = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${radialPoint(d.x, d.y)})`);

    nodeGroup
        .append("circle")
        .attr("r", 2)
        .attr("fill", "#fff")
        .attr("stroke", "#4299e1")
        .attr("stroke-width", 1);
}
