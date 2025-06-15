import type { HierarchyNode, HierarchyPointNode, Selection } from "d3";
import type { Item } from "../../../types";
import { createTreeLayout } from "./createTreeLayout";
import { renderLinks } from "./renderLinks";
import { renderNodes } from "./renderNodes";
import { setupZoom } from "./setupZoom";

type NodeWithSaved<T> = HierarchyNode<T> & {
    savedChildren?: HierarchyNode<T>[];
};

export function initializeNodes(root: HierarchyNode<Item>, expandedNodes: Set<string>) {
    root.descendants().forEach((d) => {
        if (d.depth > 2 && !expandedNodes.has(d.data.name)) {
            const node = d as NodeWithSaved<Item>;
            node.savedChildren = node.children;
            node.children = undefined;
        }
    });
}

export function updateVisualization(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    root: HierarchyNode<Item>,
    width: number,
    height: number,
    onToggle: (node: HierarchyPointNode<Item>) => void,
    onContextMenu: (event: MouseEvent, node: HierarchyPointNode<Item>) => void
) {
    svg.selectAll("g").remove();

    const g = svg.append("g").attr("class", "zoom-layer");
    const { nodes, links } = createTreeLayout(root, width);

    renderLinks(g, links);
    renderNodes(g, nodes as HierarchyPointNode<Item>[], onToggle, onContextMenu);
    setupZoom(svg, g, width, height);
}
