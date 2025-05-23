import React, { useState, useRef, useEffect } from 'react';
import './MapEditor.css';

interface Cell {
    texture: string | null;
    mirror: boolean;
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
    const [map, setMap] = useState<Cell[][]>(
        Array(32).fill(null).map(() =>
            Array(32).fill(null).map(() => ({ texture: null, mirror: false, object: null }))
        )
    );
    const [walls, setWalls] = useState<Wall[][][]>([
        Array(32).fill(null).map(() => Array(31).fill(null).map(() => ({ texture: null, mirror: false }))), // Вертикальные
        Array(31).fill(null).map(() => Array(32).fill(null).map(() => ({ texture: null, mirror: false }))), // Горизонтальные
    ]);
    const isMouseDown = useRef(false);

    const handleMouseAction = (_e: React.MouseEvent<HTMLDivElement>, x: number, y: number, type: 'cell' | 'vWall' | 'hWall') => {
        if (type === 'vWall' && selectedTexture && x < 31) {
            setWalls((prev) => {
                const newWalls = [...prev];
                if (newWalls[0][y][x].texture === selectedTexture) {
                    newWalls[0][y][x] = { ...newWalls[0][y][x], mirror: !newWalls[0][y][x].mirror };
                } else {
                    newWalls[0][y][x] = { texture: selectedTexture, mirror: false };
                }
                return newWalls;
            });
        } else if (type === 'hWall' && selectedTexture && y < 31) {
            setWalls((prev) => {
                const newWalls = [...prev];
                if (newWalls[1][y][x].texture === selectedTexture) {
                    newWalls[1][y][x] = { ...newWalls[1][y][x], mirror: !newWalls[1][y][x].mirror };
                } else {
                    newWalls[1][y][x] = { texture: selectedTexture, mirror: false };
                }
                return newWalls;
            });
        } else if (type === 'cell' && selectedObject) {
            setMap((prev) => {
                const newMap = [...prev];
                newMap[y][x] = { ...newMap[y][x], object: selectedObject };
                return newMap;
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, x: number, y: number, type: 'cell' | 'vWall' | 'hWall') => {
        isMouseDown.current = true;
        handleMouseAction(e, x, y, type);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, x: number, y: number, type: 'cell' | 'vWall' | 'hWall') => {
        if (isMouseDown.current) {
            handleMouseAction(e, x, y, type);
        }
    };

    const handleMouseUp = () => {
        isMouseDown.current = false;
    };

    const saveMap = () => {
        const data = { map, walls };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
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
                        <div className="row">
                            {Array(32).fill(null).map((_, x) => (
                                <React.Fragment key={`cell-${x}-${y}`}>
                                    <div
                                        className="cell"
                                        onMouseDown={(e) => handleMouseDown(e, x, y, 'cell')}
                                        onMouseEnter={(e) => handleMouseEnter(e, x, y, 'cell')}
                                    >
                                        {map[y][x].object && (
                                            <div
                                                className="object"
                                                style={{
                                                    backgroundImage: `url(/objects/${map[y][x].object})`,
                                                    backgroundSize: 'cover',
                                                }}
                                            />
                                        )}
                                    </div>
                                    {x < 31 && (
                                        <div
                                            className="v-wall"
                                            style={{
                                                backgroundImage: walls[0][y][x].texture ? `url(/textures/${walls[0][y][x].texture})` : undefined,
                                                backgroundSize: 'cover',
                                                transform: walls[0][y][x].mirror ? 'scaleX(-1)' : undefined,
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, x, y, 'vWall')}
                                            onMouseEnter={(e) => handleMouseEnter(e, x, y, 'vWall')}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {y < 31 && (
                            <div className="h-wall-row">
                                {Array(32).fill(null).map((_, x) => (
                                    <div
                                        key={`h-wall-${x}-${y}`}
                                        className="h-wall"
                                        style={{
                                            backgroundImage: walls[1][y][x].texture ? `url(/textures/${walls[1][y][x].texture})` : undefined,
                                            backgroundSize: 'cover',
                                            transform: walls[1][y][x].mirror ? 'scaleX(-1)' : undefined,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, x, y, 'hWall')}
                                        onMouseEnter={(e) => handleMouseEnter(e, x, y, 'hWall')}
                                    />
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
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