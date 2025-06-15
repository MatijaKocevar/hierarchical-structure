export function radialPoint(x: number, y: number): [number, number] {
    return [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];
}
