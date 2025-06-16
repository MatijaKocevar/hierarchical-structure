import { useState, useEffect, useCallback } from "react";
import { generateHierarchicalData, updateNodeValue, countLeafNodes } from "./utils";
import { Header } from "./components/header/Header";
import { MainContent } from "./components/MainContent";
import type { Item, Operation } from "./types";

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

    const handleValueChange = (path: number[], newValue: number, operation?: Operation) => {
        if (!data) return;

        const newData = updateNodeValue(data, path, newValue, operation);

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
