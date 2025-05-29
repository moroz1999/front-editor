import React from 'react';
import './HWall.css';
import {getTextureByNumber} from './mapTextures.ts';

interface WallProps {
    texture: number | null;
    mirror: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const HWall: React.FC<WallProps> = ({texture, mirror, onMouseDown, onMouseEnter}) => {
    const selectedTexture = getTextureByNumber(texture);

    const hasImage = selectedTexture?.image;
    const className = `h-wall ${mirror ? ' h-mirrored' : ''} ${hasImage ? ' h-has-image' : ''}`;
    return <div
        className={className}
        style={{
            backgroundImage: hasImage ? `url(${selectedTexture?.image})` : undefined,
        }}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    />;
};

export default HWall;