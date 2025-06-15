import { useRef, useState } from "react";
import type { HierarchyPointNode } from "d3";
import type { Item } from "../../types";
import { ContextMenu } from "./ContextMenu";
import { TreeVisualization } from "./TreeVisualization";

interface TreeViewProps {
    data: Item | null;
    onValueChange: (path: number[], value: number, operation?: "skip" | "invert") => void;
}

interface ContextMenuPosition {
    x: number;
    y: number;
    node: HierarchyPointNode<Item>;
}

export function TreeView({ data, onValueChange }: TreeViewProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
    const expandedNodesRef = useRef<Set<string>>(new Set());

    function handleContextMenu(event: MouseEvent, node: HierarchyPointNode<Item>) {
        event.preventDefault();

        const svgRect = svgRef.current?.getBoundingClientRect();

        if (svgRect) {
            setContextMenu({
                x: event.clientX - svgRect.left,
                y: event.clientY - svgRect.top,
                node,
            });
        }
    }

    function handleAction(action: "skip" | "invert") {
        if (contextMenu) {
            const node = contextMenu.node;
            const path = [] as number[];
            let current: HierarchyPointNode<Item> | null = node;

            while (current.parent) {
                const parentChildren = current.parent.children || [];

                path.unshift(parentChildren.indexOf(current));

                current = current.parent;
            }

            onValueChange(path, node.data.value, action);
            setContextMenu(null);
        }
    }

    return (
        <div className="relative w-full h-full">
            <svg ref={svgRef} className="w-full h-full" style={{ minHeight: "600px" }} />
            {data && (
                <TreeVisualization
                    data={data}
                    svgRef={svgRef}
                    expandedNodes={expandedNodesRef.current}
                    onContextMenu={handleContextMenu}
                />
            )}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    node={contextMenu.node}
                    onAction={handleAction}
                />
            )}
        </div>
    );
}
