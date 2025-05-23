import React, {useState, useRef, useEffect} from 'react';
import Cell from './Cell';
import HWall from './HWall';
import VWall from './VWall';
import './MapEditor.css';

interface CellData {
    object: string | null;
}

interface Wall {
    texture: string | null;
    mirror: boolean;
}

const MapEditor: React.FC<{ selectedTexture: string | null; selectedObject: string | null }> = ({
                                                                                                    selectedTexture,
                                                                                                    selectedObject,
                                                                                                }) => {
    const [map, setMap] = useState<CellData[][]>(
        Array(32).fill(null).map(() =>
            Array(32).fill(null).map(() => ({object: null})),
        ),
    );
    const [walls, setWalls] = useState<Wall[][][]>([
        Array(32).fill(null).map(() => Array(31).fill(null).map(() => ({texture: null, mirror: false}))), // Вертикальные
        Array(32).fill(null).map(() => Array(32).fill(null).map(() => ({texture: null, mirror: false}))), // Горизонтальные
    ]);
    const isMouseDown = useRef(false);

    const handleMouseAction = (_e: React.MouseEvent<HTMLDivElement>, x: number, y: number, type: 'cell' | 'vWall' | 'hWall') => {
        if (type === 'vWall' && selectedTexture && x < 31) {
            setWalls((prev) => {
                const newWalls = [...prev];
                if (newWalls[0][y][x].texture === selectedTexture) {
                    newWalls[0][y][x] = {...newWalls[0][y][x], mirror: !newWalls[0][y][x].mirror};
                } else {
                    newWalls[0][y][x] = {texture: selectedTexture, mirror: false};
                }
                return newWalls;
            });
        } else if (type === 'hWall' && selectedTexture) {
            setWalls((prev) => {
                const newWalls = [...prev];
                if (newWalls[1][y][x].texture === selectedTexture) {
                    newWalls[1][y][x] = {...newWalls[1][y][x], mirror: !newWalls[1][y][x].mirror};
                } else {
                    newWalls[1][y][x] = {texture: selectedTexture, mirror: false};
                }
                return newWalls;
            });
        } else if (type === 'cell' && selectedObject) {
            setMap((prev) => {
                const newMap = [...prev];
                newMap[y][x] = {...newMap[y][x], object: selectedObject};
                return newMap;
            });
        }
    };

    const handleMouseDown = (x: number, y: number, type: 'cell' | 'vWall' | 'hWall') => {
        return (e: React.MouseEvent<HTMLDivElement>) => {
            isMouseDown.current = true;
            handleMouseAction(e, x, y, type);
        };
    };

    const handleMouseEnter = (x: number, y: number, type: 'cell' | 'vWall' | 'hWall') => {
        return (e: React.MouseEvent<HTMLDivElement>) => {
            if (isMouseDown.current) {
                handleMouseAction(e, x, y, type);
            }
        };
    };

    const handleMouseUp = () => {
        isMouseDown.current = false;
    };

    const saveMap = () => {
        const data = {map, walls};
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'map.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadMap = (data: string) => {
        const parsed = JSON.parse(data);
        setMap(parsed.map);
        setWalls(parsed.walls);
    };

    useEffect(() => {
        const mapEditor = document.querySelector('.map-editor');
        if (mapEditor) {
            mapEditor.addEventListener('saveMap', saveMap);
        }
        return () => {
            if (mapEditor) {
                mapEditor.removeEventListener('saveMap', saveMap);
            }
        };
    }, [map, walls]);

    return (
        <div className="map-editor" onMouseUp={handleMouseUp}>
            <div className="grid">
                {Array(32).fill(null).map((_, y) => (
                    <React.Fragment key={`row-${y}`}>
                        <div className="h-wall-row">
                            {Array(32).fill(null).map((_, x) => (
                                <HWall
                                    key={`h-wall-${x}-${y}`}
                                    texture={walls[1][y][x].texture}
                                    mirror={walls[1][y][x].mirror}
                                    onMouseDown={handleMouseDown(x, y, 'hWall')}
                                    onMouseEnter={handleMouseEnter(x, y, 'hWall')}
                                />
                            ))}
                        </div>
                        <div className="row">
                            {Array(32).fill(null).map((_, x) => (
                                <React.Fragment key={`cell-${x}-${y}`}>
                                    <Cell
                                        object={map[y][x].object}
                                        onMouseDown={handleMouseDown(x, y, 'cell')}
                                        onMouseEnter={handleMouseEnter(x, y, 'cell')}
                                    />
                                    {x < 31 && (
                                        <VWall
                                            texture={walls[0][y][x].texture}
                                            mirror={walls[0][y][x].mirror}
                                            onMouseDown={handleMouseDown(x, y, 'vWall')}
                                            onMouseEnter={handleMouseEnter(x, y, 'vWall')}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <input
                type="file"
                accept=".json"
                style={{display: 'none'}}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (event.target?.result) {
                                loadMap(event.target.result as string);
                            }
                        };
                        reader.readAsText(file);
                    }
                }}
            />
        </div>
    );
};

export default MapEditor;