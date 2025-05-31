import type { Map } from '../types/Map.ts';

export const emptyWall = {texture: null, mirror: false};

export function makeEmptyMap(): Map {
    return {
        hWalls: Array(32).fill(null).map(() => Array(32).fill(emptyWall)),
        vWalls: Array(32).fill(null).map(() => Array(31).fill(emptyWall)),
        cells:  Array(32).fill(null).map(() => Array(32).fill({ object: null })),
    };
}
