import type {MapTextureSelectorValue} from '../types/MapTextureSelectorValue.ts';

export const MAP_TEXTURES: MapTextureSelectorValue[] = [
    { number: null, image: null },
    { number: 16, image: '/textures/00.bmp' },
    { number: 17, image: '/textures/01.bmp' },
    { number: 18, image: '/textures/02.bmp' },
    { number: 19, image: '/textures/03.bmp' },
    { number: 20, image: '/textures/04.bmp' },
    { number: 21, image: '/textures/05.bmp' },
    { number: 22, image: '/textures/06.bmp' },
    { number: 23, image: '/textures/07.bmp' },
    { number: 24, image: '/textures/08.bmp' },
    { number: 25, image: '/textures/09.bmp' },
    { number: 26, image: '/textures/10.bmp' },
    { number: 27, image: '/textures/11.bmp' },
    { number: 28, image: '/textures/12.bmp' },
    { number: 29, image: '/textures/13.bmp' },
    { number: 30, image: '/textures/14.bmp' },
    { number: 31, image: '/textures/15.bmp' },
    { number: 32, image: '/textures/16.bmp' },
    { number: 33, image: '/textures/17.bmp' },
    { number: 34, image: '/textures/18.bmp' },
    { number: 35, image: '/textures/19.bmp' },
    { number: 36, image: null },
    { number: 37, image: null },
    { number: 38, image: null },
    { number: 39, image: null },
];
export const getTextureByNumber = (n: number | null): MapTextureSelectorValue | undefined => {
    return MAP_TEXTURES.find(texture => texture.number === n);
};