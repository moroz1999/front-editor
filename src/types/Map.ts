import type {CellData} from './CellData.ts';
import type {WallState} from './WallState.ts';

export interface Map {
    hWalls: WallState[][];
    vWalls: WallState[][];
    cells: CellData[][];
}