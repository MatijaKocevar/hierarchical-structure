import type { Item, Operation } from "../types";
export * from "./dataGenerator";
export * from "./flattenData";

export const countLeafNodes = (node: Item | null): number => {
    if (!node) return 0;

    if (!node.children || node.children.length === 0) return 1;

    return node.children.reduce((sum, child) => sum + countLeafNodes(child), 0);
};

const getEffectiveValue = (node: Item): number => {
    if (node.isSkipped) return 0;
    if (node.isInverted) return -node.value;
    return node.value;
};

const updateParentValues = (node: Item): void => {
    if (node.children && node.children.length > 0) {
        node.children.forEach(child => updateParentValues(child));
        
        const childrenSum = node.children.reduce((sum, child) => {
            return sum + getEffectiveValue(child);
        }, 0);
        
        node.value = childrenSum;
    }
};

export const recalculateValues = (node: Item): number => {
    updateParentValues(node);

    return getEffectiveValue(node);
};

export const recalculateValuesPartial = (data: Item, changedPath: number[]): void => {
    if (changedPath.length === 0) {
        recalculateValues(data);
        return;
    }

    let current = data;
    const pathToRoot: Item[] = [data];

    for (let i = 0; i < changedPath.length - 1; i++) {
        if (current.children) {
            current = current.children[changedPath[i]];
            pathToRoot.push(current);
        }
    }

    for (let i = pathToRoot.length - 1; i >= 0; i--) {
        const node = pathToRoot[i];

        if (node.children && node.children.length > 0) {
            const childrenSum = node.children.reduce((sum, child) => {
                if (!child.children || child.children.length === 0) {
                    return sum + getEffectiveValue(child);
                } else {
                    return sum + getEffectiveValue(child);
                }
            }, 0);

            node.value = childrenSum;
        }
    }
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

        recalculateValuesPartial(newData, path);
    }

    return newData;
}
