interface DatasetControlsProps {
    depth: number;
    onDepthChange: (depth: number) => void;
    leafNodesCount: number;
}

export function DatasetControls({ depth, onDepthChange, leafNodesCount }: DatasetControlsProps) {
    const handleInputChange = (value: string) => {
        const numValue = parseInt(value);

        if (!isNaN(numValue) && numValue >= 0) {
            onDepthChange(numValue);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <label className="text-sm">Hierarchy Depth:</label>
                <input
                    type="number"
                    min="0"
                    // max="10"
                    value={depth}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="px-2 py-1 text-sm rounded border w-24"
                />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Leaf Nodes: {leafNodesCount}</span>
            </div>
        </div>
    );
}
