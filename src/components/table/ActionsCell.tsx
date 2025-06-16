import * as d3 from "d3";
import type { FlatDataType, Operation } from "../../types";

export function createActionsCell(
    rows: d3.Selection<HTMLTableRowElement, FlatDataType, HTMLTableSectionElement, unknown>,
    onValueChange?: (path: number[], newValue: number, operation?: Operation) => void
) {
    const cells = rows
        .append("td")
        .attr("class", "w-[140px] px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right");

    cells.each(function (d: FlatDataType) {
        const cell = d3.select(this);

        if (d.depth > 0) {
            const buttonContainer = cell
                .append("div")
                .attr("class", "flex items-center justify-end gap-2");

            buttonContainer
                .append("button")
                .attr(
                    "class",
                    `w-[60px] px-2 py-1 text-xs rounded ${
                        d.item.isSkipped ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`
                )
                .text(d.item.isSkipped ? "Unskip" : "Skip")
                .on("click", (event) => {
                    if (onValueChange) {
                        event.preventDefault();

                        onValueChange(d.path, d.item.value, d.item.isSkipped ? "unskip" : "skip");
                    }
                });

            buttonContainer
                .append("button")
                .attr(
                    "class",
                    `w-[60px] px-2 py-1 text-xs rounded ${
                        d.item.isInverted
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                    }`
                )
                .text(d.item.isInverted ? "Uninvert" : "Invert")
                .on("click", (event) => {
                    if (onValueChange) {
                        event.preventDefault();

                        onValueChange(
                            d.path,
                            d.item.value,
                            d.item.isInverted ? "uninvert" : "invert"
                        );
                    }
                });
        }
    });
}
