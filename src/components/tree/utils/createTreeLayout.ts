import * as d3 from "d3";
import type { HierarchyNode } from "d3";
import type { Item } from "../../../types";

export function createTreeLayout(root: HierarchyNode<Item>, width: number) {
    const dx = 10;
    const dy = width / (root.height + 1);
    const layout = d3.cluster<Item>().nodeSize([dx, dy]);
    const clusterRoot = layout(root);
    let x0 = Infinity;
    let x1 = -x0;

    clusterRoot.each((d) => {
        if (d.x !== undefined) {
            if (d.x > x1) x1 = d.x;

            if (d.x < x0) x0 = d.x;
        }
    });

    return {
        nodes: clusterRoot.descendants(),
        links: clusterRoot.links(),
        height: x1 - x0 + dx * 2,
    };
}
