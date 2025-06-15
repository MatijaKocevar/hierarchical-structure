import * as d3 from "d3";
import type { Selection } from "d3";

export function setupZoom(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    g: Selection<SVGGElement, unknown, null, undefined>,
    width: number,
    height: number,
    onZoom?: () => void
) {
    const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            if (onZoom) onZoom();
            g.attr("transform", event.transform);
        });

    svg.call(zoom).on("dblclick.zoom", null);

    const gbbox = (g.node() as SVGGElement).getBBox();
    const scale = Math.min(0.9, height / gbbox.height);
    const centerX = width * 0.2;
    const centerY = height / 2;
    const translateX = centerX - gbbox.x * scale;
    const translateY = centerY - (gbbox.y + gbbox.height / 2) * scale;

    zoom.transform(svg, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
}
