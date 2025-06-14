interface ViewControlsProps {
    activeView: "table" | "tree";
    onViewChange: (view: "table" | "tree") => void;
}

export function ViewControls({ activeView, onViewChange }: ViewControlsProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onViewChange("table")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                    activeView === "table" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
            >
                Table View
            </button>
            <button
                onClick={() => onViewChange("tree")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                    activeView === "tree" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
            >
                Tree View
            </button>
        </div>
    );
}
