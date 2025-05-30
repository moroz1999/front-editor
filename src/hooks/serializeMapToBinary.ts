import type {Map} from '../types/Map.ts';
import type {WallState} from '../types/WallState.ts';
import type {CellData} from '../types/CellData.ts';

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
const ENCODING_BIGL_OFFSET = 0x40;

const encodeWallByte = (wall: WallState): number => {
    if (!wall.texture && !wall.mirror) return BYTE_EMPTY;
    if (!wall.texture && wall.mirror) return BYTE_EMPTY_MIRRORED;

    const t = wall.texture!;
    let byte = 0;
    if (t >= 16) {
        byte = (t << 1) + ENCODING_BIGL_OFFSET;
    } else {
        byte = ((t - 1) << 1) + ENCODING_STANDARD_MIN;
    }

    if (wall.mirror) byte |= 1;
    return byte;
};

const encodeWallRow = (row: WallState[], isVertical: boolean): number[] => {
    let lastIndex = row.length - 1;
    while (
        lastIndex >= 0 &&
        row[lastIndex].texture === null &&
        row[lastIndex].mirror === false
        ) {
        lastIndex--;
    }

    const bytes: number[] = [];
    let i = 0;
    while (i <= lastIndex) {
        const wall = row[i];
        const isEmpty = wall.texture === null && wall.mirror === false;

        if (isEmpty) {
            let run = 1;
            while (
                i + run <= lastIndex &&
                row[i + run].texture === null &&
                row[i + run].mirror === false &&
                run < 255
                ) {
                run++;
            }

            if (run === 1) {
                bytes.push(BYTE_EMPTY);
                i++;
            } else if (run === 2) {
                bytes.push(BYTE_EMPTY, BYTE_EMPTY);
                i += 2;
            } else {
                bytes.push(BYTE_RLE, run);
                i += run;
            }
        } else {
            bytes.push(encodeWallByte(wall));
            i++;
        }
    }

    bytes.push(BYTE_END_ROW);
    return bytes;
};

export const serializeMapToBinary = (map: Map): Uint8Array => {
    const buffer: number[] = [];

    let objectsAmount = 0;
    let exitX = -1, exitY = -1;
    let startX = -1, startY = -1;
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            const obj = map.cells[y][x].object;
            if (obj === 29) {
                exitX = x;
                exitY = y;
                map.cells[y][x].object = null;
            }
            if (obj === 31) {
                startX = x;
                startY = y;
                map.cells[y][x].object = null;
            }
            if (map.cells[y][x].object !== null) {
                objectsAmount++;
            }
        }
    }
    buffer.push(...[
        0x41, // '?'
        0x30, // gfxnr
        0x41, // muznr
        0x03, 0x00, 0x07, // пол, потолок, color
        ...new Array(23).fill(0x20), // levname
        0x00, // null-term
        objectsAmount, // objects count
        0x00, 0x00, // prizes
    ]);
    buffer.push(exitX);
    buffer.push(exitY + OFFSET_Y_BASE);
    buffer.push(0x00, 0x00); // yx (?)
    buffer.push(startX, startY + OFFSET_Y_BASE); // YX
    buffer.push(0x40, 0x00); // angle

    // Объекты на карте (кроме старт/выход)
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            const obj = map.cells[y][x].object;
            if (obj != null) {
                buffer.push(
                    0x80, x,
                    0x80, y + OFFSET_Y_BASE,
                    obj,
                    0, 0x05, 0,
                );
            }
        }
    }

    buffer.push(OBJECT_END_1, OBJECT_END_2);

    // Стены
    for (let y = 0; y < MAP_SIZE; y++) {
        const hRow = encodeWallRow(map.hWalls[y], false);
        buffer.push(...hRow);

        const vRow = encodeWallRow(map.vWalls[y], true);
        buffer.push(...vRow);
    }

    buffer.push(0x00); // конец файла

    return new Uint8Array(buffer);
};
