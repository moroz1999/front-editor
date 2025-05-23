import React, { useState } from 'react';
import './TextureSelector.css';

const textures = ['empty.bmp', ...Array(24).fill(null).map((_, i) => `${String(i + 1).padStart(2, '0')}.bmp`)];

const TextureSelector: React.FC<{ onSelect: (texture: string | null) => void }> = ({ onSelect }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (texture: string) => {
        setSelected(texture);
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