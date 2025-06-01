import {useEditorStore} from '../store/EditorStore.ts';
import type {ChangeEvent} from 'react';
import {TexturePack} from '../types/TexturePack.ts';

export const TexturePackSelector = () => {
    const texturePack = useEditorStore(state => state.texturePack);
    const setTexturePack = useEditorStore(state => state.setTexturePack);
    const changePack = (event: ChangeEvent<HTMLSelectElement>) => {
        if (Object.values(TexturePack).includes(event.target.value as TexturePack)) {
            setTexturePack(event.target.value as TexturePack);
        }
    };
    return <>
        <select onChange={changePack} value={texturePack}>
            <option value={TexturePack.BUNKER}>Bunker</option>
            <option value={TexturePack.TRENCHES}>Trenches</option>
        </select>
    </>;
};