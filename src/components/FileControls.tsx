import {useCallback} from 'react';
import {serializeMapToBinary} from '../utils/serializeMapToBinary.ts';
import {makeEmptyMap} from '../utils/makeEmptyMap.ts';
import {useEditorStore} from '../store/EditorStore.ts';
import useMapLoader from '../hooks/useMapLoader.ts';

export const FileControls = () => {
    const map = useEditorStore(state => state.map);
    const setMap = useEditorStore(state => state.setMap);
    const {loadFromFile} = useMapLoader();

    const saveMap = useCallback(() => {
        const binary = serializeMapToBinary(map);
        const binBlob = new Blob([binary], {type: 'application/octet-stream'});
        const binUrl = URL.createObjectURL(binBlob);
        const binLink = document.createElement('a');
        binLink.href = binUrl;
        binLink.download = 'mapatm.E';
        binLink.click();
        URL.revokeObjectURL(binUrl);
    }, [map]);

    const newMap = () => {
        if (confirm('Sure? All unsaved changes will be lost.')) {
            setMap(makeEmptyMap());
        }
    };


    const handleLoad = (file: File) => {
        loadFromFile(file).then(setMap);
    };


    return <div className="controls">
        <button onClick={newMap}>New</button>
        <button onClick={() => document.getElementById('file-input')?.click()}>Load</button>
        <input
            id="file-input"
            type="file"
            accept=".E"
            style={{display: 'none'}}
            onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleLoad(file);
            }}
        />
        <button onClick={saveMap}>Save</button>
    </div>;
};