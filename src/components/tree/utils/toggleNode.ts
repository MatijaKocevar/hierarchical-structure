import type { HierarchyNode, HierarchyPointNode } from "d3";
import type { Item } from "../../../types";

type NodeWithSaved<T> = HierarchyNode<T> & {
    savedChildren?: HierarchyNode<T>[];
};

export function toggleNode(
    node: HierarchyPointNode<Item>,
    root: HierarchyNode<Item>,
    expandedNodes: Set<string>
) {
    const hierarchyNode = root
        .descendants()
        .find((d) => d.data === node.data) as NodeWithSaved<Item>;

    if (hierarchyNode) {
        if (hierarchyNode.children) {
            hierarchyNode.savedChildren = hierarchyNode.children;
            hierarchyNode.children = undefined;
            expandedNodes.delete(node.data.name);
        } else if (hierarchyNode.savedChildren) {
            hierarchyNode.children = hierarchyNode.savedChildren;
            hierarchyNode.savedChildren = undefined;
            expandedNodes.add(node.data.name);
        }

        return true;
    }

    return false;
}
