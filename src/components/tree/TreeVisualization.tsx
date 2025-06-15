import { useEffect, type RefObject } from "react";
import * as d3 from "d3";
import type { HierarchyPointNode } from "d3";
import type { Item } from "../../types";
import { toggleNode } from "./utils/toggleNode";
import { initializeNodes, updateVisualization } from "./utils/visualization";

interface TreeVisualizationProps {
    data: Item;
    svgRef: RefObject<SVGSVGElement | null>;
    expandedNodes: Set<string>;
    onContextMenu: (event: MouseEvent, node: HierarchyPointNode<Item>) => void;
    onZoom?: () => void;
}

export function TreeVisualization({
    data,
    svgRef,
    expandedNodes,
    onContextMenu,
    onZoom,
}: TreeVisualizationProps) {
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const root = d3.hierarchy(data);

        initializeNodes(root, expandedNodes);

        function handleToggleNode(node: HierarchyPointNode<Item>) {
            if (toggleNode(node, root, expandedNodes)) {
                updateVisualization(
                    svg,
                    root,
                    width,
                    height,
                    handleToggleNode,
                    onContextMenu,
                    onZoom
                );
            }
        }

        svg.on("click", () => {
            if (onZoom) onZoom();
        });

        svg.on("wheel", () => {
            if (onZoom) onZoom();
        });

        updateVisualization(svg, root, width, height, handleToggleNode, onContextMenu, onZoom);

        return () => {
            svg.on("click", null);
            svg.on("wheel", null);
        };
    }, [data, svgRef, expandedNodes, onContextMenu, onZoom]);

    return null;
}
