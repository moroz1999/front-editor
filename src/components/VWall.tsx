import React from 'react';
import './VWall.css';

interface WallProps {
    texture: string | null;
    mirror: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VWall: React.FC<WallProps> = ({texture, mirror, onMouseDown, onMouseEnter}) => {
    const className = `v-wall ${mirror ? 'v-mirrored' : ''}`;
    return <div
        className={className}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    >{texture &&   <div
        className="v-wall-img"
        style={{
            backgroundImage: `url(/textures/${texture})`,
        }}
    />}
    </div>;
};
export default VWall;