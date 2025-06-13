import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Item } from "../App";

interface TableViewProps {
    data: Item | null;
    onValueChange?: (path: number[], newValue: number, operation?: "skip" | "invert") => void;
}

export function TableView({ data, onValueChange }: TableViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const expandedRows = useRef(new Set<string>());

    useEffect(() => {
        if (!data || !containerRef.current) return;

        const container = d3.select(containerRef.current);

        container.selectAll("*").remove();

        const table = container.append("table").attr("class", "min-w-full bg-white");
        const thead = table.append("thead").attr("class", "bg-gray-50").append("tr");

        thead
            .append("th")
            .attr(
                "class",
                "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            )
            .text("Name");

        thead
            .append("th")
            .attr(
                "class",
                "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            )
            .text("Value");

        thead
            .append("th")
            .attr(
                "class",
                "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            )
            .text("Depth");

        const tbody = table.append("tbody").attr("class", "divide-y divide-gray-200");

        function updateTable() {
            const flatData: Array<{ item: Item; depth: number; path: number[] }> = [];

            function flattenData(item: Item, depth = 0, path: number[] = []) {
                flatData.push({ item, depth, path });

                if (item.children && expandedRows.current.has(path.join("-"))) {
                    item.children.forEach((child, index) => {
                        flattenData(child, depth + 1, [...path, index]);
                    });
                }
            }

            if (data) {
                flattenData(data);
            }

            type FlatDataType = { item: Item; depth: number; path: number[] };

            const rows = tbody
                .selectAll<HTMLTableRowElement, FlatDataType>("tr")
                .data(flatData, (d) => d.path.join("-"))
                .join("tr")
                .attr("class", "border-b border-gray-200");

            rows.selectAll("*").remove();

            rows.append("td")
                .attr("class", "px-6 py-3 text-left")
                .append("div")
                .attr("class", "flex items-center")
                .style("padding-left", (d) => `${d.depth * 20}px`)
                .each(function (d: FlatDataType) {
                    const cell = d3.select(this);
                    const hasChildren = d.item.children && d.item.children.length > 0;

                    if (hasChildren) {
                        cell.append("button")
                            .attr("class", "mr-2 w-4 text-gray-500 focus:outline-none")
                            .text(() => (expandedRows.current.has(d.path.join("-")) ? "▼" : "▶"))
                            .on("click", () => {
                                const pathKey = d.path.join("-");

                                if (expandedRows.current.has(pathKey)) {
                                    expandedRows.current.delete(pathKey);
                                } else {
                                    expandedRows.current.add(pathKey);
                                }

                                updateTable();
                            });
                    } else {
                        cell.append("span").attr("class", "mr-2 w-4");
                    }

                    cell.append("span").text(d.item.name);
                });

            rows.append("td")
                .attr("class", "px-6 py-3 text-right")
                .each(function (d: FlatDataType) {
                    const cell = d3.select(this);
                    const hasChildren = d.item.children && d.item.children.length > 0;

                    if (hasChildren) {
                        cell.append("span")
                            .text(d.item.value)
                            .attr("class", d.item.value < 0 ? "text-red-500" : "");
                    } else {
                        const container = cell
                            .append("div")
                            .attr("class", "flex items-center justify-end gap-2");

                        container
                            .append("button")
                            .attr(
                                "class",
                                "px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                            )
                            .text(d.item.isSkipped ? "Unskip" : "Skip")
                            .on("click", () => onValueChange?.(d.path, d.item.value, "skip"));

                        container
                            .append("button")
                            .attr(
                                "class",
                                "px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                            )
                            .text(d.item.isInverted ? "Uninvert" : "Invert")
                            .on("click", () => onValueChange?.(d.path, d.item.value, "invert"));

                        container
                            .append("input")
                            .attr("type", "number")
                            .attr("value", d.item.value)
                            .attr(
                                "class",
                                `w-24 px-2 py-1 text-right border rounded 
                                ${d.item.isSkipped ? "bg-gray-100" : ""} 
                                ${d.item.isInverted ? "text-red-500" : ""}`
                            )
                            .on("change", function () {
                                const newValue = Number(this.value);
                                if (!isNaN(newValue) && onValueChange) {
                                    onValueChange(d.path, newValue);
                                }
                            });
                    }
                });

            rows.append("td")
                .attr("class", "px-6 py-3 text-center")
                .text((d) => d.depth);
        }

        expandedRows.current.add("");

        updateTable();

        return () => {
            container.selectAll("*").remove();
        };
    }, [data, onValueChange]);

    return <div ref={containerRef} className="overflow-auto h-full" />;
}
