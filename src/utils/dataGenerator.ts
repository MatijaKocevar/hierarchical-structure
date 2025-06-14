import type { Item } from "../types";
import { recalculateValues } from ".";

export const generateHierarchicalData = (maxDepth: number): Item => {
    const generateLevel = (currentDepth: number = 0, parentPath: string = ""): Item => {
        const item: Item = {
            name: currentDepth === 0 ? "Root" : `Item ${parentPath}`,
            value: 100,
        };

        if (currentDepth < maxDepth) {
            const childCount = Math.floor(Math.random() * 3) + 2;
            item.children = Array(childCount)
                .fill(null)
                .map((_, index) =>
                    generateLevel(
                        currentDepth + 1,
                        parentPath ? `${parentPath}.${index + 1}` : `${index + 1}`
                    )
                );
        }

        return item;
    };

    const root = generateLevel(0);

    recalculateValues(root);

    return root;
};
