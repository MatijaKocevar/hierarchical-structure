import * as d3 from "d3";
import type { HierarchyLink, HierarchyPointNode } from "d3";
import type { Item } from "../../../types";
import { isSkipped, isInverted } from "./hierarchyHelpers";

export function renderLinks(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    links: Array<HierarchyLink<Item>>
) {
    g.append("g")
        .attr("fill", "none")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", (d) => {
            const target = d.target as HierarchyPointNode<Item>;

            if (isSkipped(target)) return "#EF4444";

            if (isInverted(target)) return "#3B82F6";

            return "#555";
        })
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("d", (d) => {
            const source = d.source as HierarchyPointNode<Item>;
            const target = d.target as HierarchyPointNode<Item>;

            return `
              M${source.y},${source.x}
              C${(source.y + target.y) / 2},${source.x}
               ${(source.y + target.y) / 2},${target.x}
               ${target.y},${target.x}
            `;
        });
}
