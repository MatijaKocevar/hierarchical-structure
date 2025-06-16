import type { Item, Operation } from "../types";
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

export function updateNodeValue(
    data: Item,
    path: number[],
    newValue: number,
    operation?: Operation
): Item {
    const newData = { ...data };
    let current = newData;

    for (let i = 0; i < path.length - 1; i++) {
        if (current.children) {
            current = current.children[path[i]];
        }
    }

    if (current.children) {
        const targetNode = current.children[path[path.length - 1]];

        switch (operation) {
            case "skip":
                targetNode.isSkipped = true;
                targetNode.isInverted = false;
                break;
            case "unskip":
                targetNode.isSkipped = false;
                break;
            case "invert":
                targetNode.isInverted = true;
                targetNode.isSkipped = false;
                break;
            case "uninvert":
                targetNode.isInverted = false;
                break;
            default:
                targetNode.value = newValue;
                targetNode.isSkipped = false;
                targetNode.isInverted = false;
        }

        recalculateValues(newData);
    }

    return newData;
}
