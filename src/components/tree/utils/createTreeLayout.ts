import * as d3 from "d3";
import type { Item } from "../../../types";

export function createTreeLayout(data: Item, width: number, height: number) {
    const radius = Math.min(width, height) / 2;
    const root = d3.hierarchy(data);
    const treeLayout = d3
        .tree<Item>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2));

    const treeData = treeLayout(root);
    const nodes = treeData.descendants();
    const levelCache = new Map<number, number>();

    nodes.forEach((node) => {
        if (!node.parent) {
            node.y = 0;
            return;
        }

        if (!levelCache.has(node.depth)) {
            levelCache.set(node.depth, node.depth * 50);
        }

        const siblings = node.parent.children || [];

        node.y = levelCache.get(node.depth)! + siblings.indexOf(node) * 15;
    });

    return {
        nodes,
        links: treeData.links(),
    };
}
