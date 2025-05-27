import { useCallback } from 'react';

interface CellData {
    object: string | null;
}

interface WallState {
    texture: string | null;
    mirror: boolean;
}

const useMapExport = (map: CellData[][], walls: WallState[][][]) => {
    const exportMapE = useCallback(() => {
        // Заголовок карты (фиксированные значения из описания)
        const header = new Uint8Array([
            // level DB "W
            0x57,
            // gfxnr DB "0
            0x30,
            // muznr DB "A
            0x41,
            // pol DB #E7
            0xe7,
            // potolok DB #F3
            0xf3,
            // color DB 7
            0x07,
            // levname DS 23, DB 0
            ...Array(23).fill(0),
            0x00,
            // monstrs DB 0
            0x00,
            // prizes DW 0
            0x00, 0x00,
            // EXITx DB 23
            0x17,
            // EXITy DB 15+#A0
            0x15 + 0xa0,
            // yx DW #8080
            0x80, 0x80,
            // YX DW #BA08
            0x08, 0xba,
            // angle DW 64
            0x40, 0x00,
        ]);

        // Формирование данных стенок
        const mapData: number[] = [];

        // Проходим по 32 рядам
        for (let y = 0; y < 32; y++) {
            // 1. Горизонтальные стенки (hWall)
            let emptyCount = 0;
            for (let x = 0; x < 32; x++) {
                const wall = walls[1][y][x]; // walls[1] — горизонтальные
                if (wall.texture === null) {
                    if (wall.mirror) {
                        // Случайно отзеркаленное пустое место
                        if (emptyCount > 0) {
                            mapData.push(0x01, emptyCount);
                            emptyCount = 0;
                        }
                        mapData.push(0xc1);
                    } else {
                        emptyCount++;
                    }
                } else {
                    if (emptyCount > 0) {
                        mapData.push(0x01, emptyCount);
                        emptyCount = 0;
                    }
                    // Текстуры 0–23 преобразуются в 16–39
                    const textureNum = parseInt(wall.texture!.replace('.bmp', ''), 10) + 16;
                    // BigL/Wolf48: N*2+#40, +1 для зеркальности
                    const code = textureNum * 2 + 0x40 + (wall.mirror ? 1 : 0);
                    mapData.push(code);
                }
            }
            if (emptyCount > 0) {
                mapData.push(0x01, emptyCount);
            }
            mapData.push(0x0d); // Конец строки

            // 2. Вертикальные стенки (vWall)
            emptyCount = 0;
            for (let x = 0; x < 31; x++) {
                const wall = walls[0][y][x]; // walls[0] — вертикальные
                if (wall.texture === null) {
                    if (wall.mirror) {
                        if (emptyCount > 0) {
                            mapData.push(0x01, emptyCount);
                            emptyCount = 0;
                        }
                        mapData.push(0xc1);
                    } else {
                        emptyCount++;
                    }
                } else {
                    if (emptyCount > 0) {
                        mapData.push(0x01, emptyCount);
                        emptyCount = 0;
                    }
                    const textureNum = parseInt(wall.texture!.replace('.bmp', ''), 10) + 16;
                    const code = textureNum * 2 + 0x40 + (wall.mirror ? 1 : 0);
                    mapData.push(code);
                }
            }
            if (emptyCount > 0) {
                mapData.push(0x01, emptyCount);
            }
            mapData.push(0x0d); // Конец строки
        }

        // Завершающие байты
        mapData.push(0xff, 0xff, 0x00);

        // Создание Blob и скачивание
        const buffer = new Uint8Array([...header, ...mapData]);
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'map.E';
        a.click();
        URL.revokeObjectURL(url);
    }, [map, walls]);

    return { exportMapE };
};

export default useMapExport;