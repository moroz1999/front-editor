import React from 'react';
import './TextureSelector.css';
import {MAP_TEXTURES} from './mapTextures.ts';

interface TextureSelectorProps {
    onSelect: (texture: number | null) => void;
    selected: number | null;
}

const TextureSelector: React.FC<TextureSelectorProps> = ({onSelect, selected}) => {
    return (
        <div className="texture-selector">
            {MAP_TEXTURES.map((texture) => (
                <div
                    key={texture.image}
                    className={'texture-selector-item ' + (selected === texture.number ? 'selected' : '')}
                    onClick={() => onSelect(texture.number)}
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