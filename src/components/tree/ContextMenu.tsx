import type { HierarchyPointNode } from "d3";
import type { Item } from "../../types";

interface ContextMenuProps {
    x: number;
    y: number;
    node: HierarchyPointNode<Item>;
    onAction: (action: "skip" | "unskip" | "invert" | "uninvert") => void;
}

export function ContextMenu({ x, y, node, onAction }: ContextMenuProps) {
    function isSkipped(node: HierarchyPointNode<Item>): boolean {
        if (node.data.isSkipped) return true;
        return node.parent ? isSkipped(node.parent) : false;
    }

    function isInverted(node: HierarchyPointNode<Item>): boolean {
        if (node.data.isInverted) return true;
        return node.parent ? isInverted(node.parent) : false;
    }

    const skipAction = isSkipped(node) ? "unskip" : "skip";
    const invertAction = isInverted(node) ? "uninvert" : "invert";

    return (
        <div
            className="absolute bg-white shadow-lg rounded-md py-1 z-50"
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => onAction(skipAction)}
            >
                {skipAction === "skip" ? "Skip" : "Unskip"}
            </button>
            <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => onAction(invertAction)}
            >
                {invertAction === "invert" ? "Invert" : "Uninvert"}
            </button>
        </div>
    );
}
