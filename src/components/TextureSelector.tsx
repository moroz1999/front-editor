import React from 'react';
import './TextureSelector.css';

const textures = [
    'empty.bmp',
    ...Array(24)
        .fill(null)
        .map((_, i) => `${String(i).padStart(2, '0')}.bmp`),
];

interface TextureSelectorProps {
    onSelect: (texture: string | null) => void;
    selected: string | null;
}

const TextureSelector: React.FC<TextureSelectorProps> = ({onSelect, selected}) => {
    const handleSelect = (texture: string) => {
        onSelect(texture === 'empty.bmp' ? null : texture);
    };

    return (
        <div className="texture-selector">
            {textures.map((texture) => (
                <img
                    key={texture}
                    src={`/textures/${texture}`}
                    alt={texture}
                    className={selected === texture ? 'selected' : ''}
                    onClick={() => handleSelect(texture)}
                />
            ))}
        </div>
    );
};

export default TextureSelector;