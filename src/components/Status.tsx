import styles from './Status.module.css';
import {useEditorStore} from '../store/EditorStore.ts';
import {getTextureByNumber} from './mapTextures.ts';
import {getObjectByNumber} from './mapObjects.ts';

export const Status = () => {
    const hoveredObject = useEditorStore(state => state.hoveredObject);
    const texturePack = useEditorStore(state => state.texturePack);
    const map = useEditorStore(state => state.map);
    const objectsAmount = map.cells.reduce((acc, row) => acc + row.reduce((acc, cell) => acc + (cell.object ? 1 : 0), 0), 0);
    const texture =
        hoveredObject ?
            (hoveredObject.type === 'wall' ?
                getTextureByNumber(hoveredObject.number, texturePack) :
                getObjectByNumber(hoveredObject.number)) :
            null;
    return <>
        <div
            className={styles.texture}
            style={texture?.image ? {backgroundImage: `url(${texture?.image}`} : undefined}
        ></div>
        {hoveredObject && <>{hoveredObject.x}:{hoveredObject.y}</>}
        {objectsAmount && <div>{objectsAmount} objects</div>}
    </>;
};