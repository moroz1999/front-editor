import React from 'react';
import './HWall.css';

interface WallProps {
    texture: string | null;
    mirror: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const HWall: React.FC<WallProps> = ({texture, mirror, onMouseDown, onMouseEnter}) => {
    const className = `h-wall ${mirror ? 'h-mirrored' : ''}`;
    return <div
        className={className}
        style={{
            backgroundImage: texture ? `url(/textures/${texture})` : undefined,
        }}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    />;
};

export default HWall;