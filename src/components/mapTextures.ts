import type {MapTextureSelectorValue} from '../types/MapTextureSelectorValue.ts';
import {BUNKER_TEXTURES} from '../types/textures/BUNKER_TEXTURES.ts';
import {TexturePack} from '../types/TexturePack.ts';
import {TRENCHES_TEXTURES} from '../types/textures/TRENCHES_TEXTURES.ts';

export const getTextureByNumber = (n: number | null, texturePack: TexturePack): MapTextureSelectorValue | undefined => {
    return texturePack === TexturePack.BUNKER ?
        BUNKER_TEXTURES.find(texture => texture.number === n):
        TRENCHES_TEXTURES.find(texture => texture.number === n);
};