import * as d3 from "d3";
import type { FlatDataType } from "../../types";

export function createNameCell(
    row: d3.Selection<HTMLTableRowElement, FlatDataType, HTMLTableSectionElement, unknown>,
    expandedRows: Set<string>,
    onExpand: (pathKey: string) => void
) {
    const cells = row.append("td").attr("class", "w-full px-6 py-3 text-left");

    cells.each(function (d: FlatDataType) {
        const cell = d3.select(this);
        const container = cell
            .append("div")
            .attr("class", "flex items-center")
            .style("padding-left", `${d.depth * 20}px`);

        const hasChildren = d.item.children && d.item.children.length > 0;

        if (hasChildren) {
            container
                .append("button")
                .attr("class", "mr-2 w-4 text-gray-500 hover:text-gray-700 focus:outline-none")
                .text(expandedRows.has(d.path.join("-")) ? "▼" : "▶")
                .on("click", (event) => {
                    event.preventDefault();
                    onExpand(d.path.join("-"));
                });
        } else {
            container.append("span").attr("class", "mr-2 w-4");
        }

        container.append("span").text(d.item.name);
    });
}
