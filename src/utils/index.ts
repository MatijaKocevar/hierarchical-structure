import type { Item } from "../types";
export * from "./dataGenerator";
export * from "./flattenData";

export const countLeafNodes = (node: Item | null): number => {
    if (!node) return 0;

    if (!node.children || node.children.length === 0) return 1;

    return node.children.reduce((sum, child) => sum + countLeafNodes(child), 0);
};

export const recalculateValues = (node: Item): number => {
    if (!node.children || node.children.length === 0) {
        return node.isSkipped ? 0 : node.isInverted ? -node.value : node.value;
    }

    const childrenSum = node.children.reduce((sum, child) => sum + recalculateValues(child), 0);

    node.value = childrenSum;

    return node.isSkipped ? 0 : node.isInverted ? -node.value : node.value;
};
