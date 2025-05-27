import type {MapObjectSelectorValue} from '../types/MapObjectSelectorValue.ts';

export const MAP_OBJECTS: MapObjectSelectorValue[] = [
    {number: null, image: 'empty.bmp'},
    ...Array(12).fill(null).map((_, i) => ({
        number: i,
        image: `${String(i).padStart(2, '0')}.bmp`,
    })),
];
export const getObjectByNumber = (n: number | null): MapObjectSelectorValue | undefined => {
    return MAP_OBJECTS.find(obj => obj.number === n);
};