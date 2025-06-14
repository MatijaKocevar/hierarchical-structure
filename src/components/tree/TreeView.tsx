import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Item } from "../../types";

interface TreeViewProps {
    data: Item | null;
}

export function TreeView({ data }: TreeViewProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("g").remove();

        const width = svgRef.current.clientWidth;
        const containerHeight = svgRef.current.clientHeight;
        const radius = Math.min(width, containerHeight) / 2;
        const g = svg.append("g").attr("class", "zoom-layer");

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

        const links = treeData.links();

        try {
            g.append("g")
                .attr("class", "links")
                .selectAll("path")
                .data(links)
                .join("path")
                .attr("d", (d) => {
                    const sourcePoint = radialPoint(d.source.x, d.source.y);
                    const targetPoint = radialPoint(d.target.x, d.target.y);
                    return `M${sourcePoint[0]},${sourcePoint[1]}L${targetPoint[0]},${targetPoint[1]}`;
                })
                .attr("fill", "none")
                .attr("stroke", "#ccc");

            const nodeGroup = g
                .append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(nodes)
                .join("g")
                .attr("class", "node")
                .attr("transform", (d) => `translate(${radialPoint(d.x, d.y)})`);

            nodeGroup
                .append("circle")
                .attr("r", 2)
                .attr("fill", "#fff")
                .attr("stroke", "#4299e1")
                .attr("stroke-width", 1);

            let frame: number | undefined;
            const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
                if (frame) cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    g.attr("transform", event.transform);
                });
            });

            svg.call(zoom);

            const centerX = width / 2;
            const centerY = containerHeight / 2;
            svg.call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(0.9));

            return () => {
                if (frame) cancelAnimationFrame(frame);
            };
        } catch (error) {
            console.error("Error during rendering:", error);
        }
    }, [data]);

    const radialPoint = (x: number, y: number): [number, number] => {
        return [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];
    };

    return <svg ref={svgRef} className="w-full h-full" style={{ minHeight: "600px" }} />;
}
