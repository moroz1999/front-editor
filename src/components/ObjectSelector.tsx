import React from 'react';
import './ObjectSelector.css';
import {MAP_OBJECTS} from './mapObjects.ts';

interface ObjectSelectorProps {
    onSelect: (object: number | null) => void;
    selected: number | null;
}

const ObjectSelector: React.FC<ObjectSelectorProps> = ({onSelect, selected}) => {
    return (
        <div
            className="object-selector"
        >
            {MAP_OBJECTS.map((object) => (
                <div
                    key={object.image}
                    className={'object-selector-item ' + (selected === object.number ? 'selected' : '')}
                    onClick={() => onSelect(object.number)}
                >
                    <div
                        className="object-image"
                        style={{
                            backgroundImage: object.image ? `url(${object.image})` : undefined,
                        }}></div>
                </div>
            ))}
        </div>
    );
};

export default ObjectSelector;
