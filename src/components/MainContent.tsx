import { TableView } from "./table/TableView";
import { TreeView } from "./tree/TreeView";
import type { Item } from "../types";

interface MainContentProps {
    activeView: "table" | "tree";
    data: Item | null;
    onValueChange: (path: number[], newValue: number, operation?: "skip" | "invert") => void;
}

export function MainContent({ activeView, data, onValueChange }: MainContentProps) {
    return (
        <div className="flex-1 p-2 min-h-0 overflow-hidden">
            <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                {activeView === "table" ? (
                    <TableView data={data} onValueChange={onValueChange} />
                ) : (
                    <TreeView data={data} onValueChange={onValueChange} />
                )}
            </div>
        </div>
    );
}
