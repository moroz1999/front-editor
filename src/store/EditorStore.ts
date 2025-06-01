import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {makeEmptyMap} from '../utils/makeEmptyMap.ts';
import type {Map} from '../types/Map.ts';
import type {ObjectInfo} from '../types/ObjectInfo.ts';
import {TexturePack} from '../types/TexturePack.ts';

interface EditorStoreState {
    map: Map,
    setMap: (m: Map) => void,
    selectedTextureNumber: number | null,
    setSelectedTextureNumber: (n: number | null) => void,
    selectedObjectNumber: number | null,
    setSelectedObjectNumber: (n: number | null) => void,
    zoom: number,
    texturePack: TexturePack,
    setTexturePack: (pack: TexturePack) => void,
    setZoom: (zoom: number) => void,
    incZoom: () => void,
    decZoom: () => void,
    hoveredObject: ObjectInfo | null,
    setHoveredObject: (object: ObjectInfo | null) => void,
}

const emptyMap = makeEmptyMap();
export const useEditorStore = create<EditorStoreState>()(
    persist(
        (set) => ({
            map: emptyMap,
            setMap: (map: Map) => set({map}),
            selectedTextureNumber: null,
            setSelectedTextureNumber: (n: number | null) => set({selectedTextureNumber: n, selectedObjectNumber: null}),
            selectedObjectNumber: null,
            setSelectedObjectNumber: (object: number | null) => set({
                selectedObjectNumber: object,
                selectedTextureNumber: null,
            }),
            hoveredObject: null,
            setHoveredObject: (object: ObjectInfo | null) => set({hoveredObject: object}),
            zoom: 1,
            setZoom: (zoom: number) => set({zoom}),
            incZoom: () => set(state => ({zoom: state.zoom + 0.25})),
            decZoom: () => set(state => ({zoom: state.zoom - 0.25})),
            texturePack: TexturePack.BUNKER,
            setTexturePack: (pack: TexturePack) => set({texturePack: pack}),
        }),
        {
            name: 'map-editor',
        },
    ),
);