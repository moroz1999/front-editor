import React from 'react';
import './VWall.css';
import {getTextureByNumber} from './mapTextures.ts';

interface WallProps {
    texture: number | null;
    mirror: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VWall: React.FC<WallProps> = ({texture, mirror, onMouseDown, onMouseEnter}) => {
    const className = `v-wall ${mirror ? 'v-mirrored' : ''}`;
    const selectedTexture = getTextureByNumber(texture);
    return <div
        className={className}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    >{texture && <div
        className="v-wall-img"
        style={{
            backgroundImage: `url(/textures/${selectedTexture?.image})`,
        }}
    />}
    </div>;
};
export default VWall;