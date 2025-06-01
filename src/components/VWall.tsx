import React from 'react';
import './VWall.css';
import {getTextureByNumber} from './mapTextures.ts';
import {useEditorStore} from '../store/EditorStore.ts';

interface WallProps {
    texture: number | null;
    mirror: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VWall: React.FC<WallProps> = ({texture, mirror, onMouseDown, onMouseEnter}) => {
    const texturePack = useEditorStore(state => state.texturePack);
    const selectedTexture = getTextureByNumber(texture, texturePack);

    const hasImage = selectedTexture?.image;
    const className = `v-wall ${mirror ? ' v-mirrored' : ''} ${hasImage ? ' v-has-image' : ''}`;
    return <div
        className={className}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
    >{texture && <div
        className="v-wall-img"
        style={{
            backgroundImage: hasImage ? `url(${selectedTexture?.image})` : undefined,
        }}
    />}
    </div>;
};
export default VWall;