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
                <img
                    key={texture.image}
                    src={`/textures/${texture.image}`}
                    alt={texture.image}
                    className={selected === texture.number ? 'selected' : ''}
                    onClick={() => onSelect(texture.number)}
                />
            ))}
        </div>
    );
};

export default TextureSelector;