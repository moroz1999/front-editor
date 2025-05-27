import React, {useState, useEffect, useCallback} from 'react';
import MapEditor from './components/MapEditor';
import type {Map} from './components/Map';
import TextureSelector from './components/TextureSelector';
import ObjectSelector from './components/ObjectSelector';
import './App.css';
import useMapLoader from './hooks/useMapLoader';

const emptyWall = {texture: null, mirror: false};
const emptyMap: Map = {
    hWalls: Array(32).fill(null).map(() => Array(32).fill(emptyWall)),
    vWalls: Array(32).fill(null).map(() => Array(31).fill(emptyWall)),
    objects: Array(32).fill(null).map(() => Array(32).fill({object: null})),
};

const App: React.FC = () => {
    const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [map, setMap] = useState<Map>(() => {
        const raw = localStorage.getItem('map');
        return raw ? JSON.parse(raw) : emptyMap;
    });
    const {loadFromFile} = useMapLoader();

    useEffect(() => {
        localStorage.setItem('map', JSON.stringify(map));
    }, [map]);

    const saveMap = useCallback(() => {
        const blob = new Blob([JSON.stringify(map)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'map.json';
        a.click();
        URL.revokeObjectURL(url);
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
                    selectedTexture={selectedTexture}
                    selectedObject={selectedObject}
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