import * as d3 from "d3";
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
    onContextMenu: (event: MouseEvent, node: HierarchyPointNode<Item>) => void,
    onZoom?: () => void
) {
    const existingZoom = d3.zoomTransform(svg.node()!);

    const existingG = svg.select<SVGGElement>(".zoom-layer");
    let g: Selection<SVGGElement, unknown, null, undefined>;

    if (existingG.empty()) {
        g = svg.append("g").attr("class", "zoom-layer") as Selection<
            SVGGElement,
            unknown,
            null,
            undefined
        >;
        setupZoom(svg, g, width, height, onZoom);
    } else {
        g = existingG;
        g.selectAll("*").remove();
    }

    const { nodes, links } = createTreeLayout(root, width);

    renderLinks(g, links);
    renderNodes(g, nodes as HierarchyPointNode<Item>[], onToggle, onContextMenu);

    if (existingZoom.k || existingZoom.x || existingZoom.y) {
        g.attr("transform", existingZoom.toString());
    }
}
