import type { HierarchyPointNode } from "d3";
import type { Item, Operation } from "../../types";
import { isSkipped, isInverted } from "./utils/hierarchyHelpers";

interface ContextMenuProps {
    x: number;
    y: number;
    node: HierarchyPointNode<Item>;
    onAction: (action: Operation) => void;
}

export function ContextMenu({ x, y, node, onAction }: ContextMenuProps) {
    const skipAction: Operation = isSkipped(node) ? "unskip" : "skip";
    const invertAction: Operation = isInverted(node) ? "uninvert" : "invert";

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
