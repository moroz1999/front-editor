import {useCallback} from 'react';
import type {WallState} from '../components/WallState.ts';
import type {CellData} from '../components/CellData.ts';
import type {Map} from '../components/Map.ts';

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
const OBJECT_TYPE_DIVISOR = 3;
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

    return {texture: textureId.toString(), mirror};
};

const parseWallRow = (
    view: DataView,
    offset: number,
    limit: number,
): WallState[] => {
    const row: WallState[] = [];

    while (offset < view.byteLength && row.length < limit) {
        const byte = view.getUint8(offset++);
        if (byte === BYTE_END_ROW) break;

        if (byte === BYTE_RLE && offset < view.byteLength) {
            const repeatCount = view.getUint8(offset++);
            for (let i = 0; i < repeatCount && row.length < limit; i++) {
                row.push(EMPTY_WALL);
            }
        } else {
            row.push(decodeWallByte(byte));
        }
    }

    return row;
};

const parseMapFile = async (file: File): Promise<Map> => {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    const objects: CellData[][] = Array(MAP_SIZE)
        .fill(null)
        .map(() => Array(MAP_SIZE).fill({object: null}));
    const hWalls: WallState[][] = [];
    const vWalls: WallState[][] = [];

    let offset = HEADER_SIZE;

    while (
        offset + 1 < view.byteLength &&
        !(view.getUint8(offset) === OBJECT_END_1 && view.getUint8(offset + 1) === OBJECT_END_2)
        ) {
        const x = view.getUint8(offset + 1);
        const y = view.getUint8(offset + 3) - OFFSET_Y_BASE;
        const type = view.getUint8(offset + 4) / OBJECT_TYPE_DIVISOR;

        offset += 8;

        if (x < MAP_SIZE && y < MAP_SIZE) {
            objects[y][x] = {object: {x, y, type}};
        }
    }

    offset += 2;

    for (let y = 0; y < MAP_SIZE; y++) {
        const hRow = parseWallRow(view, offset, MAP_SIZE);
        offset += hRow.length + 1;
        while (hRow.length < MAP_SIZE) hRow.push(EMPTY_WALL);
        hWalls.push(hRow);

        const vRow = parseWallRow(view, offset, MAP_SIZE - 1);
        offset += vRow.length + 1;
        while (vRow.length < MAP_SIZE - 1) vRow.push(EMPTY_WALL);
        vWalls.push(vRow);
    }

    console.log(hWalls, vWalls, objects);
    return {hWalls, vWalls, objects};
};

const useMapLoader = () => {
    const loadFromFile = useCallback(
        async (file: File): Promise<Map> => parseMapFile(file),
        [],
    );
    return {loadFromFile};
};

export default useMapLoader;
