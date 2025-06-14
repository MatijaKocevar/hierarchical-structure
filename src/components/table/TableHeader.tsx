import * as d3 from "d3";

export function createTableHeader(table: d3.Selection<HTMLTableElement, unknown, null, undefined>) {
    const thead = table.append("thead").attr("class", "bg-gray-50").append("tr");

    thead
        .append("th")
        .attr(
            "class",
            "w-full px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        )
        .text("Name");

    thead
        .append("th")
        .attr(
            "class",
            "w-[100px] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
        )
        .text("Value");

    thead
        .append("th")
        .attr(
            "class",
            "w-[80px] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
        )
        .text("Depth");

    thead
        .append("th")
        .attr(
            "class",
            "w-[120px] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
        )
        .text("Actions");

    return thead;
}
