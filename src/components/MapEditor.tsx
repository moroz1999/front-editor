import React, {useState, useRef, useEffect, useCallback} from 'react';
import Cell from './Cell';
import HWall from './HWall';
import VWall from './VWall';
import './MapEditor.css';

interface CellData {
    object: string | null;
}

interface WallState {
    texture: string | null;
    mirror: boolean;
}

interface MapEditorProps {
    selectedTexture: string | null;
    selectedObject: string | null;
}

type WallType = 'vWall' | 'hWall';
type ElementType = 'cell' | WallType;


const MapEditor: React.FC<MapEditorProps> = ({
                                                 selectedTexture,
                                                 selectedObject,
                                             }) => {
    const [map, setMap] = useState<CellData[][]>(
        Array(32).fill(null).map(() =>
            Array(32).fill(null).map(() => ({object: null})),
        ),
    );
    const [walls, setWalls] = useState<WallState[][][]>([
        Array(32).fill(null).map(() => Array(31).fill(null).map(() => ({texture: null, mirror: false}))), // Вертикальные
        Array(32).fill(null).map(() => Array(32).fill(null).map(() => ({texture: null, mirror: false}))), // Горизонтальные
    ]);
    const isMouseDown = useRef(false);

    const updateWall = (
        walls: WallState[][][],
        x: number,
        y: number,
        type: WallType,
        texture: string | null,
        toggleMirror: boolean = false,
    ): WallState[][][] => {
        const newWalls = [...walls];
        const index = type === 'vWall' ? 0 : 1;
        const current = newWalls[index][y][x];

        newWalls[index][y][x] = {
            texture,
            mirror: toggleMirror ? !current.mirror : current.mirror,
        };
        return newWalls;
    };

    const handleMouseDownAction = (
        e: React.MouseEvent<HTMLDivElement>,
        x: number,
        y: number,
        type: ElementType,
    ): void => {
        const isLeftClick = e.button === 0;
        const isRightClick = e.button === 2;
        if (!isLeftClick && !isRightClick) return;

        if (isRightClick) e.preventDefault();

        if (type === 'cell') {
            setMap((prev) => {
                const newMap = [...prev];
                newMap[y][x] = {
                    ...newMap[y][x],
                    object: isLeftClick ? selectedObject : null,
                };
                return newMap;
            });
            return;
        }

        if ((type === 'vWall' && x >= 31) || (!selectedTexture && isLeftClick)) return;

        const toggle =
            isLeftClick &&
            ((type === 'vWall' && selectedTexture === walls[0][y][x].texture) ||
                (type === 'hWall' && selectedTexture === walls[1][y][x].texture));
        const newWalls = updateWall(walls, x, y, type, isLeftClick ? selectedTexture : null, toggle);
        setWalls(newWalls);
    };
    const [isInitialized, setInitialized] = useState(false);

    useEffect(() => {
        const value = localStorage.getItem('walls');
        if (value !== null) {
            setWalls(JSON.parse(value));
        }
        const mapValue = localStorage.getItem('map');
        if (mapValue !== null) {
            setMap(JSON.parse(mapValue));
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('walls', JSON.stringify(walls));
        }
    }, [walls, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('map', JSON.stringify(map));
        }
    }, [map, isInitialized]);

    const handleMouseEnterAction = (x: number, y: number, type: ElementType): void => {
        if (!isMouseDown.current) return;

        if (type === 'cell' && selectedObject) {
            setMap((prev) => {
                const newMap = [...prev];
                newMap[y][x] = {
                    ...newMap[y][x],
                    object: selectedObject,
                };
                return newMap;
            });
        } else if (type !== 'cell' && selectedTexture && !(type === 'vWall' && x >= 31)) {
            const newWalls = updateWall(walls, x, y, type, selectedTexture, false);
            setWalls(newWalls);
        }
    };

    const handleMouseDown = (
        x: number,
        y: number,
        type: ElementType,
    ): ((e: React.MouseEvent<HTMLDivElement>) => void) => {
        return (e: React.MouseEvent<HTMLDivElement>): void => {
            if (e.button === 0 || e.button === 2) {
                isMouseDown.current = e.button === 0;
                handleMouseDownAction(e, x, y, type);
            }
        };
    };

    const handleMouseEnter = (
        x: number,
        y: number,
        type: ElementType,
    ): (() => void) => {
        return (): void => {
            handleMouseEnterAction(x, y, type);
        };
    };

    const handleMouseUp = (): void => {
        isMouseDown.current = false;
    };
    const saveMap = useCallback(() => {
        const data = {map, walls};
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'map.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [map, walls]);

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
    }, [map, saveMap, walls]);

    return (
        <div className="map-editor" onMouseUp={handleMouseUp} onContextMenu={(e) => e.preventDefault()}>
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