import type {MapTextureSelectorValue} from '../types/MapTextureSelectorValue.ts';

export const MAP_TEXTURES: MapTextureSelectorValue[] = [
    {number: null, image: 'empty.bmp'},
    ...Array(24).fill(null).map((_, i) => ({
        number: i + 16,
        image: `${String(i).padStart(2, '0')}.bmp`,
    })),
];
export const getTextureByNumber = (n: number | null): MapTextureSelectorValue | undefined => {
    return MAP_TEXTURES.find(texture => texture.number === n);
};