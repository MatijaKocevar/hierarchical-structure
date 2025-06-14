import type { FlatDataType, Item } from "../types";

export function flattenData(data: Item | null, expandedRows: Set<string>): FlatDataType[] {
    const flatData: FlatDataType[] = [];

    function flatten(
        item: Item,
        depth = 0,
        path: number[] = [],
        hasSkippedParent = false,
        hasInvertedParent = false
    ) {
        flatData.push({
            item,
            depth,
            path,
            value: item.value,
            isSkipped: Boolean(item.isSkipped),
            isInverted: Boolean(item.isInverted),
            hasSkippedParent: hasSkippedParent || Boolean(item.isSkipped),
            hasInvertedParent: hasInvertedParent || Boolean(item.isInverted),
        });

        if (item.children && expandedRows.has(path.join("-"))) {
            item.children.forEach((child, index) => {
                flatten(
                    child,
                    depth + 1,
                    [...path, index],
                    hasSkippedParent || Boolean(item.isSkipped),
                    hasInvertedParent || Boolean(item.isInverted)
                );
            });
        }
    }

    if (data) {
        flatten(data);
    }

    return flatData;
}
