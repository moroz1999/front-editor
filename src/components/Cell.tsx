import React from 'react';
import './Cell.css';
import {getObjectByNumber} from './mapObjects.ts';

interface CellProps {
    object: number | null;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Cell: React.FC<CellProps> = ({object, onMouseDown, onMouseEnter}) => {
    const selectedObject = getObjectByNumber(object);
    return <div
        className="cell"
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    >
        {selectedObject && (
            <div
                className="object"
                style={{
                    backgroundImage: `url(/objects/${selectedObject?.image})`,
                }}
            />
        )}
    </div>;
};

export default Cell;