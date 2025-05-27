import React from 'react';
import './ObjectSelector.css';
import {MAP_OBJECTS} from './mapObjects.ts';

interface ObjectSelectorProps {
    onSelect: (object: number | null) => void;
    selected: number | null;
}

const ObjectSelector: React.FC<ObjectSelectorProps> = ({onSelect, selected}) => {
    return (
        <div className="object-selector">
            {MAP_OBJECTS.map((object) => (
                <img
                    key={object.image}
                    src={`/objects/${object.image}`}
                    alt={object.image}
                    className={selected === object.number ? 'selected' : ''}
                    onClick={() => onSelect(object.number)}
                />
            ))}
        </div>
    );
};

export default ObjectSelector;
