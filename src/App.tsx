import React, {useState, useEffect, useCallback} from 'react';
import MapEditor from './components/MapEditor';
import type {Map} from './types/Map.ts';
import TextureSelector from './components/TextureSelector';
import ObjectSelector from './components/ObjectSelector';
import './App.css';
import useMapLoader from './hooks/useMapLoader';
import {serializeMapToBinary} from './hooks/serializeMapToBinary.ts';

const emptyWall = {texture: null, mirror: false};
const emptyMap: Map = {
    hWalls: Array(32).fill(null).map(() => Array(32).fill(emptyWall)),
    vWalls: Array(32).fill(null).map(() => Array(31).fill(emptyWall)),
    cells: Array(32).fill(null).map(() => Array(32).fill({object: null})),
};

const App: React.FC = () => {
    const [selectedTexture, setSelectedTexture] = useState<number | null>(null);
    const [selectedObject, setSelectedObject] = useState<number | null>(null);
    const [map, setMap] = useState<Map>(() => {
        const raw = localStorage.getItem('map');
        return raw ? JSON.parse(raw) : emptyMap;
    });
    const {loadFromFile} = useMapLoader();

    useEffect(() => {
        localStorage.setItem('map', JSON.stringify(map));
    }, [map]);


    const saveMap = useCallback(() => {
        const binary = serializeMapToBinary(map);
        const binBlob = new Blob([binary], {type: 'application/octet-stream'});
        const binUrl = URL.createObjectURL(binBlob);
        const binLink = document.createElement('a');
        binLink.href = binUrl;
        binLink.download = 'map.bin';
        binLink.click();
        URL.revokeObjectURL(binUrl);
    }, [map]);


    const handleLoad = (file: File) => {
        loadFromFile(file).then(setMap);
    };

    return (
        <div className="app">
            <div className="editor">
                <MapEditor
                    map={map}
                    onChange={setMap}
                    selectedTextureNumber={selectedTexture}
                    selectedObjectNumber={selectedObject}
                />
            </div>
            <div className="sidebar">
                <TextureSelector
                    onSelect={texture => {
                        setSelectedTexture(texture);
                        setSelectedObject(null);
                    }}
                    selected={selectedTexture}
                />
                <ObjectSelector
                    onSelect={object => {
                        setSelectedObject(object);
                        setSelectedTexture(null);
                    }}
                    selected={selectedObject}
                />
                <div className="controls">
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
                </div>
            </div>
        </div>
    );
};

export default App;