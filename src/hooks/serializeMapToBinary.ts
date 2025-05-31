import type {Map} from '../types/Map.ts';
import type {WallState} from '../types/WallState.ts';

const MAP_SIZE = 32;
const BYTE_EMPTY = 0x20;
const BYTE_EMPTY_MIRRORED = 0xC1;
const BYTE_END_ROW = 0x0d;
const BYTE_RLE = 0x01;
const OBJECT_END_1 = 0xff;
const OBJECT_END_2 = 0xff;
const OFFSET_Y_BASE = 0xA0;
const ENCODING_STANDARD_MIN = 0x31;
const ENCODING_BIGL_OFFSET = 0x40;

const encodeWallByte = (wall: WallState): number => {
    if (!wall.texture && !wall.mirror) return BYTE_EMPTY;
    if (!wall.texture && wall.mirror) return BYTE_EMPTY_MIRRORED;

    const t = wall.texture!;
    let byte;
    if (t >= 16) {
        byte = (t << 1) + ENCODING_BIGL_OFFSET;
    } else {
        byte = ((t - 1) << 1) + ENCODING_STANDARD_MIN;
    }

    if (wall.mirror) byte |= 1;
    return byte;
};

const isEmptyWall = (wall: WallState): boolean =>
    wall.texture === null && !wall.mirror;

const encodeEmptyWallSequence = (
    row: WallState[],
    startIndex: number,
    lastValidIndex: number,
): { bytes: number[], nextIndex: number } => {
    const MAX_RUN_LENGTH = 255;
    let runLength = 1;

    while (
        startIndex + runLength <= lastValidIndex &&
        isEmptyWall(row[startIndex + runLength]) &&
        runLength < MAX_RUN_LENGTH
        ) {
        runLength++;
    }

    if (runLength === 1) return {bytes: [BYTE_EMPTY], nextIndex: startIndex + 1};
    if (runLength === 2) return {bytes: [BYTE_EMPTY, BYTE_EMPTY], nextIndex: startIndex + 2};

    return {bytes: [BYTE_RLE, runLength], nextIndex: startIndex + runLength};
};

const encodeWallRow = (row: WallState[]): number[] => {
    let lastValidIndex = row.length - 1;
    while (lastValidIndex >= 0 && isEmptyWall(row[lastValidIndex])) {
        lastValidIndex--;
    }

    const encodedBytes: number[] = [];
    let currentIndex = 0;

    while (currentIndex <= lastValidIndex) {
        const currentWall = row[currentIndex];

        if (isEmptyWall(currentWall)) {
            const {bytes, nextIndex} = encodeEmptyWallSequence(row, currentIndex, lastValidIndex);
            encodedBytes.push(...bytes);
            currentIndex = nextIndex;
        } else {
            encodedBytes.push(encodeWallByte(currentWall));
            currentIndex++;
        }
    }

    encodedBytes.push(BYTE_END_ROW);
    return encodedBytes;
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
        const hRow = encodeWallRow(map.hWalls[y]);
        buffer.push(...hRow);

        const vRow = encodeWallRow(map.vWalls[y]);
        buffer.push(...vRow);
    }

    buffer.push(0x00); // конец файла

    return new Uint8Array(buffer);
};
