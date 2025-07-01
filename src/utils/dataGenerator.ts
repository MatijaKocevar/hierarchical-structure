import type { Item } from "../types";
import { recalculateValues } from ".";

export const generateHierarchicalData = (maxDepth: number): Item => {
    const generateLevel = (parentPath: string = "", currentDepth: number = 0): Item => {
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
                        parentPath ? `${parentPath}.${index + 1}` : `${index + 1}`,
                        currentDepth + 1
                    )
                );
        }

        return item;
    };

    const root = generateLevel();

    recalculateValues(root);

    return root;
};
