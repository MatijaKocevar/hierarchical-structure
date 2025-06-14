import * as d3 from "d3";
import type { FlatDataType } from "../../types";

export function createDepthCell(
    row: d3.Selection<HTMLTableRowElement, FlatDataType, HTMLTableSectionElement, unknown>
) {
    row.append("td")
        .attr("class", "w-[80px] px-6 py-3 text-center whitespace-nowrap")
        .text((d) => d.depth);
}
