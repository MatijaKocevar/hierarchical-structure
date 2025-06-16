import * as d3 from "d3";
import type { HierarchyPointNode } from "d3";
import type { Item } from "../../../types";
import { isSkipped, isInverted } from "./hierarchyHelpers";

type NodeWithSaved = HierarchyPointNode<Item> & {
    savedChildren?: HierarchyPointNode<Item>[];
};

export function renderNodes(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    nodes: Array<HierarchyPointNode<Item>>,
    onToggle: (node: HierarchyPointNode<Item>) => void,
    onContextMenu: (event: MouseEvent, node: HierarchyPointNode<Item>) => void
) {
    const nodeGroup = g.append("g").selectAll("g").data(nodes).join("g").attr("cursor", "pointer");

    nodeGroup
        .append("circle")
        .attr("cx", (d) => d.y)
        .attr("cy", (d) => d.x)
        .attr("fill", (d) => {
            const node = d as NodeWithSaved;

            if (isSkipped(node)) return "#EF4444";
            if (isInverted(node)) return "#3B82F6";

            return node.savedChildren ? "#555" : node.children ? "#999" : "#fff";
        })
        .attr("stroke", "#555")
        .attr("r", 2.5)
        .on("click", (_event, d) => {
            const node = d as NodeWithSaved;

            if (node.children || node.savedChildren) onToggle(d);
        })
        .on("contextmenu", (event, d) => {
            onContextMenu(event, d);
        });

    nodeGroup
        .append("text")
        .attr("x", (d) => d.y)
        .attr("y", (d) => d.x)
        .attr("dy", "0.32em")
        .attr("dx", (d) => {
            const node = d as NodeWithSaved;

            return node.children || node.savedChildren ? -6 : 6;
        })
        .attr("text-anchor", (d) => {
            const node = d as NodeWithSaved;

            return node.children || node.savedChildren ? "end" : "start";
        })
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif")
        .attr("stroke", "#fff")
        .attr("stroke-width", "3")
        .attr("paint-order", "stroke")
        .text((d) => d.data.value)
        .on("click", (_event, d) => {
            const node = d as NodeWithSaved;

            if (node.children || node.savedChildren) onToggle(d);
        })
        .on("contextmenu", (event, d) => {
            onContextMenu(event, d);
        });
}
