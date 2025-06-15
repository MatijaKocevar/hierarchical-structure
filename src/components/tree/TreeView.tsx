import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Item } from "../../types";
import { createTreeLayout } from "./utils/createTreeLayout";
import { renderLinks } from "./utils/renderLinks";
import { renderNodes } from "./utils/renderNodes";
import { setupZoom } from "./utils/setupZoom";

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
        const height = svgRef.current.clientHeight;
        const g = svg.append("g").attr("class", "zoom-layer");

        try {
            const { nodes, links } = createTreeLayout(data, width, height);

            renderLinks(g, links);
            renderNodes(g, nodes);

            const frame = setupZoom(svg, g, width, height);

            return () => {
                if (frame) cancelAnimationFrame(frame);
            };
        } catch (error) {
            console.error("Error during rendering:", error);
        }
    }, [data]);

    return <svg ref={svgRef} className="w-full h-full" style={{ minHeight: "600px" }} />;
}
