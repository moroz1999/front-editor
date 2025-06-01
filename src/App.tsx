import React from 'react';
import MapEditor from './components/MapEditor';
import TextureSelector from './components/TextureSelector';
import ObjectSelector from './components/ObjectSelector';
import './App.css';
import {useEditorStore} from './store/EditorStore.ts';
import {ZoomSelector} from './components/ZoomSelector.tsx';
import {FileControls} from './components/FileControls.tsx';
import {TexturePackSelector} from './components/TexturePackSelector.tsx';
import {Status} from './components/Status.tsx';

const App: React.FC = () => {
    const zoom = useEditorStore(state => state.zoom);

    return (
        <div className="app">
            <div className="editor" style={{zoom}}>
                <MapEditor/>
            </div>
            <div className="sidebar">
                <ZoomSelector/>
                <TexturePackSelector/>
                <TextureSelector/>
                <ObjectSelector/>
                <FileControls/>
                <Status/>
            </div>
        </div>
    );
};

export default App;