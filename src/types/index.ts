export interface Item {
    name: string;
    value: number;
    children?: Item[];
    isSkipped?: boolean;
    isInverted?: boolean;
}

export type FlatDataType = {
    item: Item;
    depth: number;
    path: number[];
    value: number;
    isSkipped: boolean;
    isInverted: boolean;
    hasSkippedParent: boolean;
    hasInvertedParent: boolean;
};
