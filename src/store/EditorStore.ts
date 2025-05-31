import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {makeEmptyMap} from '../utils/makeEmptyMap.ts';
import type {Map} from '../types/Map.ts';

interface EditorStoreState {
    map: Map,
    setMap: (m: Map) => void,
    selectedTextureNumber: number | null,
    setSelectedTextureNumber: (n: number | null) => void,
    selectedObjectNumber: number | null,
    setSelectedObjectNumber: (n: number | null) => void,
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
        }),
        {
            name: 'map-editor',
        },
    ),
);