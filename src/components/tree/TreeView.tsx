import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { HierarchyPointNode } from "d3";
import type { Item } from "../../types";
import { createTreeLayout } from "./utils/createTreeLayout";
import { renderLinks } from "./utils/renderLinks";
import { renderNodes } from "./utils/renderNodes";
import { setupZoom } from "./utils/setupZoom";

interface TreeViewProps {
    data: Item | null;
}

type NodeWithSaved<T> = d3.HierarchyNode<T> & {
    savedChildren?: d3.HierarchyNode<T>[];
};

export function TreeView({ data }: TreeViewProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        const svg = d3.select(svgRef.current);

        svg.selectAll("g").remove();

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        const root = d3.hierarchy(data);

        root.descendants().forEach((d) => {
            if (d.depth > 2) {
                const node = d as NodeWithSaved<Item>;
                node.savedChildren = node.children;
                node.children = undefined;
            }
        });

        function updateVisualization() {
            svg.selectAll("g").remove();

            const g = svg.append("g").attr("class", "zoom-layer");
            const { nodes, links } = createTreeLayout(root, width);

            renderLinks(g, links);
            renderNodes(g, nodes as HierarchyPointNode<Item>[], toggleNode);
            setupZoom(svg, g, width, height);
        }

        function toggleNode(node: HierarchyPointNode<Item>) {
            const hierarchyNode = root
                .descendants()
                .find((d) => d.data === node.data) as NodeWithSaved<Item>;
            if (hierarchyNode) {
                if (hierarchyNode.children) {
                    hierarchyNode.savedChildren = hierarchyNode.children;
                    hierarchyNode.children = undefined;
                } else if (hierarchyNode.savedChildren) {
                    hierarchyNode.children = hierarchyNode.savedChildren;
                    hierarchyNode.savedChildren = undefined;
                }

                updateVisualization();
            }
        }

        updateVisualization();
    }, [data]);

    return <svg ref={svgRef} className="w-full h-full" style={{ minHeight: "600px" }} />;
}
