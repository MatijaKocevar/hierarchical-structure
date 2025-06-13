import { useState, useEffect } from "react";
import { generateHierarchicalData } from "./utils/dataGenerator";
import { TreeView } from "./components/TreeView";
import { TableView } from "./components/TableView";

export interface Item {
    name: string;
    value: number;
    children?: Item[];
    isSkipped?: boolean;
    isInverted?: boolean;
}

function App() {
    const [data, setData] = useState<Item | null>(null);
    const [activeDataset, setActiveDataset] = useState<"small" | "medium" | "large">("small");
    const [activeView, setActiveView] = useState<"table" | "tree">("table");

    const generateData = (type: "small" | "medium" | "large") => {
        setActiveDataset(type);

        switch (type) {
            case "small":
                setData(generateHierarchicalData(10, 2, 3));
                break;
            case "medium":
                setData(generateHierarchicalData(1000, 2, 5));
                break;
            case "large":
                setData(generateHierarchicalData(10000, 3, 7));
                break;
        }
    };

    const handleValueChange = (path: number[], newValue: number, operation?: "skip" | "invert") => {
        if (!data) return;

        const newData = { ...data };
        let current = newData;

        for (let i = 0; i < path.length - 1; i++) {
            if (current.children) {
                current = current.children[path[i]];
            }
        }

        if (current.children) {
            const targetNode = current.children[path[path.length - 1]];

            if (operation === "skip") {
                targetNode.isSkipped = !targetNode.isSkipped;
                targetNode.isInverted = false;
            } else if (operation === "invert") {
                targetNode.isInverted = !targetNode.isInverted;
                targetNode.isSkipped = false;
            } else {
                targetNode.value = newValue;
                targetNode.isSkipped = false;
                targetNode.isInverted = false;
            }

            const recalculateValues = (node: Item): number => {
                if (!node.children || node.children.length === 0) {
                    if (node.isSkipped) return 0;
                    return node.isInverted ? -node.value : node.value;
                }
                const childrenSum = node.children.reduce(
                    (sum, child) => sum + recalculateValues(child),
                    0
                );
                node.value = node.isSkipped ? 0 : childrenSum;
                return node.value;
            };

            recalculateValues(newData);
        }

        setData(newData);
    };

    useEffect(() => {
        generateData("small");
    }, []);

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <div className="flex-none p-2 bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-2">
                    Hierarchical Structure Visualization
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <button
                            onClick={() => generateData("small")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                                activeDataset === "small" ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                        >
                            Small Dataset
                        </button>
                        <button
                            onClick={() => generateData("medium")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                                activeDataset === "medium"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                            }`}
                        >
                            Medium Dataset (1k nodes)
                        </button>
                        <button
                            onClick={() => generateData("large")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                                activeDataset === "large" ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                        >
                            Large Dataset (10k nodes)
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveView("table")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                                activeView === "table" ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                        >
                            Table View
                        </button>
                        <button
                            onClick={() => setActiveView("tree")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                                activeView === "tree" ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                        >
                            Tree View
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-2 min-h-0 overflow-hidden">
                <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                    {activeView === "table" ? (
                        <TableView data={data} onValueChange={handleValueChange} />
                    ) : (
                        <TreeView data={data} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
