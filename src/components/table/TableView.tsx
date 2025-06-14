import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { FlatDataType, Item } from "../../types";
import { createTableHeader } from "./TableHeader";
import { createNameCell } from "./NameCell";
import { createValueCell } from "./ValueCell";
import { createDepthCell } from "./DepthCell";
import { createActionsCell } from "./ActionsCell";
import { flattenData } from "../../utils/flattenData";

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

        createTableHeader(table);

        const tbody = table.append("tbody").attr("class", "divide-y divide-gray-200");

        function updateTable() {
            const flatData = flattenData(data, expandedRows.current);

            const rows = tbody
                .selectAll<HTMLTableRowElement, FlatDataType>("tr")
                .data(flatData, (d) => d.path.join("-"))
                .join("tr")
                .attr("class", (d) => {
                    if (d.hasSkippedParent || d.item.isSkipped) {
                        return "bg-gray-50 border-b border-gray-200";
                    }
                    if (d.hasInvertedParent || d.item.isInverted) {
                        return "bg-red-50 border-b border-gray-200";
                    }
                    return "border-b border-gray-200";
                });

            rows.selectAll("*").remove();

            createNameCell(rows, expandedRows.current, (pathKey) => {
                if (expandedRows.current.has(pathKey)) {
                    expandedRows.current.delete(pathKey);
                } else {
                    expandedRows.current.add(pathKey);
                }
                updateTable();
            });
            createValueCell(rows, onValueChange);
            createDepthCell(rows);
            createActionsCell(rows, onValueChange);
        }

        expandedRows.current.add("");

        updateTable();

        return () => {
            container.selectAll("*").remove();
        };
    }, [data, onValueChange]);

    return <div ref={containerRef} className="overflow-auto h-full" />;
}
