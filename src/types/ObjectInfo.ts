export interface ObjectInfo {
    x: number;
    y: number;
    number: number | null;
    type: 'cell' | 'wall';
    mirrored: boolean;
}