import { useState, useEffect } from "react";
import { generateHierarchicalData } from "./utils/dataGenerator";
import { TreeView } from "./components/TreeView";

export interface Item {
    name: string;
    value: number;
    children?: Item[];
}

function App() {
    const [data, setData] = useState<Item | null>(null);
    const [activeDataset, setActiveDataset] = useState<"small" | "medium" | "large">("small");

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
                    <div className="flex flex-wrap items-center gap-2">
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
                </div>
            </div>

            <div className="flex-1 p-2 min-h-0 overflow-hidden">
                <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <TreeView data={data} />
                </div>
            </div>
        </div>
    );
}

export default App;
