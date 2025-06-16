import * as d3 from "d3";
import type { FlatDataType } from "../../types";

type ValueChangeHandler = (path: number[], value: number, action?: "skip" | "invert") => void;

export function createValueCell(
    row: d3.Selection<HTMLTableRowElement, FlatDataType, HTMLTableSectionElement, unknown>,
    onValueChange: ValueChangeHandler | undefined
) {
    row.append("td")
        .attr("class", "w-[100px] px-6 py-3 text-right whitespace-nowrap")
        .each(function (d: FlatDataType) {
            const cell = d3.select(this);
            const hasChildren = d.item.children && d.item.children.length > 0;

            if (hasChildren) {
                cell.append("span").text(d.item.value);
            } else {
                cell.append("input")
                    .attr("type", "number")
                    .attr("value", d.item.value)
                    .attr("class", "w-24 px-2 py-1 text-right border rounded")
                    .on("change", function () {
                        const newValue = Number(this.value);

                        if (!isNaN(newValue) && onValueChange) {
                            onValueChange(d.path, newValue);
                        }
                    });
            }
        });
}
