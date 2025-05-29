import {useCallback} from 'react';
import type {WallState} from '../types/WallState.ts';
import type {CellData} from '../types/CellData.ts';
import type {Map} from '../types/Map.ts';

const EMPTY_WALL: WallState = {texture: null, mirror: false};
const MAP_SIZE = 32;
const BYTE_EMPTY = 0x20;
const BYTE_EMPTY_MIRRORED = 0xC1;
const BYTE_END_ROW = 0x0d;
const BYTE_RLE = 0x01;
const HEADER_SIZE = 41;
const OBJECT_END_1 = 0xff;
const OBJECT_END_2 = 0xff;
const OFFSET_Y_BASE = 0xA0;
const ENCODING_STANDARD_MIN = 0x31;
const ENCODING_BIGL_MIN = 0x60;
const ENCODING_BIGL_OFFSET = 0x40;

const decodeWallByte = (byte: number): WallState => {
    if (byte === BYTE_EMPTY || byte === BYTE_EMPTY_MIRRORED) return EMPTY_WALL;

    const mirror = (byte & 1) === 1;
    let textureId: number;

    if (byte >= ENCODING_BIGL_MIN) {
        textureId = (byte - ENCODING_BIGL_OFFSET) >> 1;
    } else if (byte >= ENCODING_STANDARD_MIN) {
        textureId = ((byte - ENCODING_STANDARD_MIN) >> 1) + 1;
    } else {
        return EMPTY_WALL;
    }

    return {texture: textureId, mirror};
};

const parseWallRow = (
    view: DataView,
    offset: number,
    limit: number,
): [WallState[], number] => {
    const row: WallState[] = [];
    let offsetShift = 0;
    while (offset < view.byteLength && row.length < limit) {
        offsetShift++;
        const byte = view.getUint8(offset++);
        if (byte === BYTE_END_ROW) break;

        if (byte === BYTE_RLE && offset < view.byteLength) {
            const repeatCount = view.getUint8(offset++);
            offsetShift++;
            for (let i = 0; i < repeatCount && row.length < limit; i++) {
                row.push(EMPTY_WALL);
            }
        } else {
            row.push(decodeWallByte(byte));
        }
    }

    return [row, offsetShift];
};

const parseHeader = (view: DataView): {exitX: number, exitY: number} => {
    const exitX = view.getUint8(33);
    const exitY = view.getUint8(34) - OFFSET_Y_BASE;
    return {exitX, exitY};
};

const parseMapFile = async (file: File): Promise<Map> => {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    const cells: CellData[][] = Array(MAP_SIZE)
        .fill(null)
        .map(() => Array(MAP_SIZE).fill({object: null}));
    const hWalls: WallState[][] = [];
    const vWalls: WallState[][] = [];

    const {exitX, exitY} = parseHeader(view);

    let offset = HEADER_SIZE;

    while (
        offset + 1 < view.byteLength &&
        !(view.getUint8(offset) === OBJECT_END_1 && view.getUint8(offset + 1) === OBJECT_END_2)
        ) {
        const x = view.getUint8(offset + 1);
        const y = view.getUint8(offset + 3) - OFFSET_Y_BASE;
        const type = view.getUint8(offset + 4);

        offset += 8;

        if (x < MAP_SIZE && y < MAP_SIZE) {
            cells[y][x] = {object: type};
        }
    }

    offset += 2;

    if (exitX < MAP_SIZE && exitY < MAP_SIZE) {
        cells[exitY][exitX] = {object: 29};
    }

    for (let y = 0; y < MAP_SIZE; y++) {
        const [hRow, hShift] = parseWallRow(view, offset, MAP_SIZE);
        offset += hShift;
        while (hRow.length < MAP_SIZE) hRow.push(EMPTY_WALL);
        hWalls.push(hRow);

        const [vRow, vShift] = parseWallRow(view, offset, MAP_SIZE - 1);
        offset += vShift;
        while (vRow.length < MAP_SIZE) vRow.push(EMPTY_WALL);
        vWalls.push(vRow);
    }

    return {hWalls, vWalls, cells};
};

const useMapLoader = () => {
    const loadFromFile = useCallback(
        async (file: File): Promise<Map> => parseMapFile(file),
        [],
    );
    return {loadFromFile};
};

export default useMapLoader;
