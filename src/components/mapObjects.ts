import type {MapObjectSelectorValue} from '../types/MapObjectSelectorValue.ts';

export const MAP_OBJECTS: MapObjectSelectorValue[] = [
    {number: null, image: null},
    {number: 1, image: '/objects/standface.png'},
    {number: 2, image: '/objects/standback.png'},
    {number: 3, image: '/objects/walknorth.gif'},
    {number: 4, image: '/objects/walksouth.gif'},
    {number: 5, image: '/objects/walkeast.gif'},
    {number: 6, image: '/objects/walkwest.gif'},
    {number: 7, image: '/objects/ammo.png'},
    {number: 8, image: '/objects/medkit.png'},
    {number: 9, image: '/textures/bunker/column.png'},
    {number: 27, image: '/objects/teleport1-1.png'},
    {number: 28, image: '/objects/teleport1-2.png'},
    {number: 29, image: '/objects/exit.png'},
    {number: 31, image: '/objects/start.png'},
];

export const getObjectByNumber = (n: number | null): MapObjectSelectorValue | undefined => {
    return MAP_OBJECTS.find(obj => obj.number === n);
};