import type {CellData} from './CellData';
import type {WallState} from './WallState';

export interface Map {
    hWalls: WallState[][];
    vWalls: WallState[][];
    objects: CellData[][];
}