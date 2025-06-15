import type { HierarchyPointNode } from "d3";
import type { Item } from "../../types";

interface ContextMenuProps {
    x: number;
    y: number;
    node: HierarchyPointNode<Item>;
    onAction: (action: "skip" | "invert") => void;
}

export function ContextMenu({ x, y, onAction }: ContextMenuProps) {
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
                onClick={() => onAction("skip")}
            >
                Skip
            </button>
            <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => onAction("invert")}
            >
                Invert
            </button>
        </div>
    );
}
