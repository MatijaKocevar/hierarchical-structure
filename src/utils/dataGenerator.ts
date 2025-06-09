import type { Item } from "../App";

const generateRandomName = () => {
    const prefixes = ["Group", "Unit", "Dept", "Section", "Team"];
    const suffixes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
        suffixes[Math.floor(Math.random() * suffixes.length)]
    }`;
};

const generateRandomValue = () => Math.floor(Math.random() * 1000) + 100;

export const generateHierarchicalData = (
    targetLeafCount: number,
    minChildren = 2,
    maxChildren = 5
): Item => {
    const determineChildCount = (remainingLeaves: number): number => {
        if (remainingLeaves <= 1) return 0;

        return Math.min(
            Math.floor(Math.random() * (maxChildren - minChildren + 1)) + minChildren,
            remainingLeaves
        );
    };

    const generateLevel = (remainingLeaves: number): Item => {
        const item: Item = {
            name: generateRandomName(),
            value: generateRandomValue(),
        };

        const childCount = determineChildCount(remainingLeaves);

        if (childCount > 0) {
            const baseLeaves = Math.floor(remainingLeaves / childCount);
            const extraLeaves = remainingLeaves % childCount;

            item.children = Array(childCount)
                .fill(null)
                .map((_, idx) => {
                    const childLeaves = baseLeaves + (idx < extraLeaves ? 1 : 0);
                    return generateLevel(childLeaves);
                });
        }

        return item;
    };

    return generateLevel(targetLeafCount);
};
