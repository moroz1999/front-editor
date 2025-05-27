import React, {useRef} from 'react';
import Cell from './Cell';
import HWall from './HWall';
import VWall from './VWall';
import './MapEditor.css';
import type {Map} from './Map';

interface MapEditorProps {
    map: Map;
    onChange: (map: Map) => void;
    selectedTexture: string | null;
    selectedObject: string | null;
}

type WallType = 'vWall' | 'hWall'
type ElementType = 'cell' | WallType

const MapEditor: React.FC<MapEditorProps> = ({map, onChange, selectedTexture, selectedObject}) => {
    const isMouseDown = useRef(false);

    const updateWall = (
        m: Map,
        x: number,
        y: number,
        type: WallType,
        texture: string | null,
        toggleMirror = false,
    ): Map => {
        const next: Map = {
            hWalls: m.hWalls.map(r => r.slice()),
            vWalls: m.vWalls.map(r => r.slice()),
            objects: m.objects.map(r => r.slice()),
        };
        if (type === 'vWall') {
            const current = next.vWalls[y][x];
            next.vWalls[y][x] = {texture, mirror: toggleMirror ? !current.mirror : current.mirror};
        } else {
            const current = next.hWalls[y][x];
            next.hWalls[y][x] = {texture, mirror: toggleMirror ? !current.mirror : current.mirror};
        }
        return next;
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
            onChange({
                ...map,
                objects: map.objects.map((row, yi) =>
                    row.map((cell, xi) => (xi === x && yi === y ? {
                        ...cell,
                        object: isLeftClick ? selectedObject : null,
                    } : cell)),
                ),
            });
            return;
        }

        if ((type === 'vWall' && x >= 31) || (!selectedTexture && isLeftClick)) return;

        const toggle =
            isLeftClick &&
            ((type === 'vWall' && selectedTexture === map.vWalls[y][x].texture) ||
                (type === 'hWall' && selectedTexture === map.hWalls[y][x].texture));
        const newMap = updateWall(map, x, y, type as WallType, isLeftClick ? selectedTexture : null, toggle);
        onChange(newMap);
    };

    const handleMouseEnterAction = (x: number, y: number, type: ElementType): void => {
        if (!isMouseDown.current) return;

        if (type === 'cell' && selectedObject) {
            onChange({
                ...map,
                objects: map.objects.map((row, yi) =>
                    row.map((cell, xi) => (xi === x && yi === y ? {...cell, object: selectedObject} : cell)),
                ),
            });
        } else if (type !== 'cell' && selectedTexture && !(type === 'vWall' && x >= 31)) {
            const newMap = updateWall(map, x, y, type as WallType, selectedTexture, false);
            onChange(newMap);
        }
    };

    const handleMouseDown = (x: number, y: number, type: ElementType) => (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.button === 0 || e.button === 2) {
            isMouseDown.current = e.button === 0;
            handleMouseDownAction(e, x, y, type);
        }
    };

    const handleMouseEnter = (x: number, y: number, type: ElementType) => (): void => {
        handleMouseEnterAction(x, y, type);
    };

    const handleMouseUp = (): void => {
        isMouseDown.current = false;
    };

    return (
        <div className="map-editor" onMouseUp={handleMouseUp} onContextMenu={e => e.preventDefault()}>
            <div className="grid">
                {Array(32)
                    .fill(null)
                    .map((_, y) => (
                        <React.Fragment key={`row-${y}`}>
                            <div className="h-wall-row">
                                {Array(32)
                                    .fill(null)
                                    .map((_, x) => (
                                        <HWall
                                            key={`h-wall-${x}-${y}`}
                                            texture={map.hWalls[y][x].texture}
                                            mirror={map.hWalls[y][x].mirror}
                                            onMouseDown={handleMouseDown(x, y, 'hWall')}
                                            onMouseEnter={handleMouseEnter(x, y, 'hWall')}
                                        />
                                    ))}
                            </div>
                            <div className="row">
                                {Array(32)
                                    .fill(null)
                                    .map((_, x) => (
                                        <React.Fragment key={`cell-${x}-${y}`}>
                                            <Cell
                                                object={map.objects[y][x].object}
                                                onMouseDown={handleMouseDown(x, y, 'cell')}
                                                onMouseEnter={handleMouseEnter(x, y, 'cell')}
                                            />
                                            {x < 31 && (
                                                <VWall
                                                    texture={map.vWalls[y][x].texture}
                                                    mirror={map.vWalls[y][x].mirror}
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
        </div>
    );
};

export default MapEditor;