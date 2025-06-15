import * as d3 from "d3";
import type { HierarchyPointLink } from "d3";
import type { Item } from "../../../types";
import { radialPoint } from "../../../utils";

export function renderLinks(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    links: Array<HierarchyPointLink<Item>>
) {
    g.append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("d", (d) => {
            const sourcePoint = radialPoint(d.source.x, d.source.y);
            const targetPoint = radialPoint(d.target.x, d.target.y);
            return `M${sourcePoint[0]},${sourcePoint[1]}L${targetPoint[0]},${targetPoint[1]}`;
        })
        .attr("fill", "none")
        .attr("stroke", "#ccc");
}
