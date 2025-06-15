import * as d3 from "d3";

export function setupZoom(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    width: number,
    height: number
) {
    let frame: number | undefined;
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            g.attr("transform", event.transform);
        });
    });

    svg.call(zoom);

    const centerX = width / 2;
    const centerY = height / 2;

    svg.call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(0.9));

    return frame;
}
