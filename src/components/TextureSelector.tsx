import React, {useMemo} from 'react';
import './TextureSelector.css';
import {useEditorStore} from '../store/EditorStore.ts';
import {BUNKER_TEXTURES} from '../types/textures/BUNKER_TEXTURES.ts';
import {TRENCHES_TEXTURES} from '../types/textures/TRENCHES_TEXTURES.ts';
import {TexturePack} from '../types/TexturePack.ts';

const TextureSelector: React.FC = () => {
    const selectedTextureNumber = useEditorStore((state) => state.selectedTextureNumber);
    const setSelectedTextureNumber = useEditorStore((state) => state.setSelectedTextureNumber);
    const texturePack = useEditorStore((state) => state.texturePack);
    const textures = useMemo(() => {
        return texturePack === TexturePack.BUNKER ? BUNKER_TEXTURES : TRENCHES_TEXTURES;
    }, [texturePack]);
    return (
        <div className="texture-selector">
            {textures.map((texture) => (
                <div
                    key={texture.number}
                    className={'texture-selector-item ' + (selectedTextureNumber === texture.number ? 'selected' : '')}
                    onClick={() => setSelectedTextureNumber(texture.number)}
                >
                    <div
                        className="texture-image"
                        style={{
                            backgroundImage: texture.image ? `url(${texture.image})` : undefined,
                        }}></div>
                </div>

            ))}
        </div>
    );
};

export default TextureSelector;