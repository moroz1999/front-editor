import React from 'react';
import './Cell.css';

interface CellProps {
    object: string | null;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Cell: React.FC<CellProps> = ({ object, onMouseDown, onMouseEnter }) => (
    <div
        className="cell"
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    >
        {object && (
            <div
                className="object"
                style={{
                    backgroundImage: `url(/objects/${object})`,
                }}
            />
        )}
    </div>
);

export default Cell;