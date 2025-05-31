import React from 'react';
import './ObjectSelector.css';
import {MAP_OBJECTS} from './mapObjects.ts';
import {useEditorStore} from '../store/EditorStore.ts';


const ObjectSelector: React.FC = () => {
    const selectedObjectNumber = useEditorStore((state) => state.selectedObjectNumber);
    const setSelectedObjectNumber = useEditorStore((state) => state.setSelectedObjectNumber);
    return (
        <div
            className="object-selector"
        >
            {MAP_OBJECTS.map((object) => (
                <div
                    key={object.image}
                    className={'object-selector-item ' + (selectedObjectNumber === object.number ? 'selected' : '')}
                    onClick={() => setSelectedObjectNumber(object.number)}
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
