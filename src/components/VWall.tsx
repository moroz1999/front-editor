import React from 'react';
import './VWall.css';

interface WallProps {
    texture: string | null;
    mirror: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VWall: React.FC<WallProps> = ({ texture, mirror, onMouseDown, onMouseEnter }) => {
    const className = `v-wall ${mirror ? 'v-mirrored' : ''}`;
    return <div
        className={className}
        style={{
            backgroundImage: texture ? `url(/textures/${texture})` : undefined,
        }}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    />
}
export default VWall;