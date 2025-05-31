import React from 'react';
import './TextureSelector.css';
import {MAP_TEXTURES} from './mapTextures.ts';
import {useEditorStore} from '../store/EditorStore.ts';

const TextureSelector: React.FC = () => {
    const selectedTextureNumber = useEditorStore((state) => state.selectedTextureNumber);
    const setSelectedTextureNumber = useEditorStore((state) => state.setSelectedTextureNumber);
    return (
        <div className="texture-selector">
            {MAP_TEXTURES.map((texture) => (
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