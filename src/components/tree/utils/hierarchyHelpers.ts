import type { HierarchyPointNode } from "d3";
import type { Item } from "../../../types";

export function isSkipped(node: HierarchyPointNode<Item>): boolean {
    if (node.data.isSkipped) return true;

    return node.parent ? isSkipped(node.parent) : false;
}

export function isInverted(node: HierarchyPointNode<Item>): boolean {
    if (node.data.isInverted) return true;

    return node.parent ? isInverted(node.parent) : false;
}
