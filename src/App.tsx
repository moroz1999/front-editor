import React, { useState } from 'react';
import MapEditor from './components/MapEditor';
import TextureSelector from './components/TextureSelector';
import ObjectSelector from './components/ObjectSelector';
import './App.css';

const App: React.FC = () => {
    const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);

    return (
        <div className="app">
            <div className="editor">
                <MapEditor selectedTexture={selectedTexture} selectedObject={selectedObject} />
            </div>
            <div className="sidebar">
                <TextureSelector onSelect={setSelectedTexture} />
                <ObjectSelector onSelect={setSelectedObject} />
                <div className="controls">
                    <button onClick={() => document.getElementById('file-input')?.click()}>
                        Load
                    </button>
                    <input
                        id="file-input"
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    if (event.target?.result) {
                                        // Обработка в MapEditor
                                    }
                                };
                                reader.readAsText(file);
                            }
                        }}
                    />
                    <button onClick={() => {
                        const mapEditor = document.querySelector('.map-editor');
                        if (mapEditor) {
                            const event = new Event('saveMap');
                            mapEditor.dispatchEvent(event);
                        }
                    }}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;