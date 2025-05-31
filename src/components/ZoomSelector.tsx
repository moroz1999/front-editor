import {useEditorStore} from '../store/EditorStore.ts';
import styles from './ZoomSelector.module.css';

export const ZoomSelector = () => {
    const zoom = useEditorStore(state => state.zoom);
    const incZoom = useEditorStore(state => state.incZoom);
    const decZoom = useEditorStore(state => state.decZoom);
    return <div className={styles.zoom}>
        <button onClick={decZoom}>-</button>
        <div className={styles.input}>
            {zoom}
        </div>
            <button onClick={incZoom}>+
        </button>
    </div>;
};