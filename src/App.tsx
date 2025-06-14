import { useState, useEffect, useCallback } from "react";
import { generateHierarchicalData } from "./utils";
import { recalculateValues, countLeafNodes } from "./utils";
import { Header } from "./components/header/Header";
import { MainContent } from "./components/MainContent";
import type { Item } from "./types";

function App() {
    const [data, setData] = useState<Item | null>(null);
    const [depth, setDepth] = useState(2);
    const [activeView, setActiveView] = useState<"table" | "tree">("table");
    const [leafNodesCount, setLeafNodesCount] = useState(0);

    const generateData = useCallback((newDepth: number) => {
        setDepth(newDepth);

        const newData = generateHierarchicalData(newDepth);

        setData(newData);
        setLeafNodesCount(countLeafNodes(newData));
    }, []);

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

            recalculateValues(newData);
        }

        setData(newData);
    };

    useEffect(() => {
        generateData(depth);
    }, [generateData, depth]);

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <Header
                depth={depth}
                activeView={activeView}
                onDepthChange={generateData}
                onViewChange={setActiveView}
                leafNodesCount={leafNodesCount}
            />
            <MainContent activeView={activeView} data={data} onValueChange={handleValueChange} />
        </div>
    );
}

export default App;
