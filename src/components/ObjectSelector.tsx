import React, { useState } from 'react';
import './ObjectSelector.css';

const objects = ['empty.bmp', ...Array(12).fill(null).map((_, i) => `${String(i + 1).padStart(2, '0')}.bmp`)];

const ObjectSelector: React.FC<{ onSelect: (object: string | null) => void }> = ({ onSelect }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (object: string) => {
        setSelected(object);
        onSelect(object === 'empty.bmp' ? null : object);
    };

    return (
        <div className="object-selector">
            {objects.map((object) => (
                <img
                    key={object}
                    src={`/objects/${object}`}
                    alt={object}
                    className={selected === object ? 'selected' : ''}
                    onClick={() => handleSelect(object)}
                />
            ))}
        </div>
    );
};

export default ObjectSelector;