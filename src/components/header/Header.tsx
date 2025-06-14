import { DatasetControls } from "./DatasetControls";
import { ViewControls } from "./ViewControls";

interface HeaderProps {
    depth: number;
    activeView: "table" | "tree";
    onDepthChange: (depth: number) => void;
    onViewChange: (view: "table" | "tree") => void;
    leafNodesCount: number;
}

export function Header({
    depth,
    activeView,
    onDepthChange,
    onViewChange,
    leafNodesCount,
}: HeaderProps) {
    return (
        <div className="flex-none p-2 bg-white shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-2">
                Hierarchical Structure Visualization
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                <DatasetControls
                    depth={depth}
                    onDepthChange={onDepthChange}
                    leafNodesCount={leafNodesCount}
                />
                <ViewControls activeView={activeView} onViewChange={onViewChange} />
            </div>
        </div>
    );
}
