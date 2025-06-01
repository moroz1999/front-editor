import React, {useRef} from 'react';
import Cell from './Cell';
import HWall from './HWall';
import VWall from './VWall';
import './MapEditor.css';
import type {Map} from '../types/Map.ts';
import {useEditorStore} from '../store/EditorStore.ts';

type WallType = 'vWall' | 'hWall'
type ElementType = 'cell' | WallType

const MapEditor: React.FC = () => {
    const map = useEditorStore(state => state.map);
    const setMap = useEditorStore((state) => state.setMap);
    const selectedTextureNumber = useEditorStore((state) => state.selectedTextureNumber);
    const selectedObjectNumber = useEditorStore((state) => state.selectedObjectNumber);
    const isMouseDown = useRef(false);
    const setHoveredObject = useEditorStore((state) => state.setHoveredObject);
    const updateWall = (
        m: Map,
        x: number,
        y: number,
        type: WallType,
        texture: number | null,
        toggleMirror = false,
    ): Map => {
        const next: Map = {
            hWalls: m.hWalls.map(r => r.slice()),
            vWalls: m.vWalls.map(r => r.slice()),
            cells: m.cells.map(r => r.slice()),
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
            setMap({
                ...map,
                cells: map.cells.map((row, yi) =>
                    row.map((cell, xi) => (xi === x && yi === y ? {
                        ...cell,
                        object: isLeftClick ? selectedObjectNumber : null,
                    } : cell)),
                ),
            });
            return;
        }

        if ((type === 'vWall' && x >= 31) || (!selectedTextureNumber && isLeftClick)) return;

        const toggle =
            isLeftClick &&
            ((type === 'vWall' && selectedTextureNumber === map.vWalls[y][x].texture) ||
                (type === 'hWall' && selectedTextureNumber === map.hWalls[y][x].texture));
        const newMap = updateWall(map, x, y, type as WallType, isLeftClick ? selectedTextureNumber : null, toggle);
        setMap(newMap);
    };

    const handleMouseEnterAction = (x: number, y: number, type: ElementType): void => {
        if (type === 'hWall') {
            setHoveredObject({
                x,
                y,
                number: map.hWalls[y][x].texture,
                type: 'wall',
                mirrored: map.hWalls[y][x].mirror,
            });
        } else if (type === 'vWall') {
            setHoveredObject({
                x,
                y,
                number: map.vWalls[y][x].texture,
                type: 'wall',
                mirrored: map.vWalls[y][x].mirror,
            });
        } else if (type === 'cell') {
            setHoveredObject({
                x,
                y,
                number: map.cells[y][x].object,
                type: 'cell',
                mirrored: false,
            });
        }

        if (!isMouseDown.current) return;

        if (type === 'cell' && selectedObjectNumber) {
            setMap({
                ...map,
                cells: map.cells.map((row, yi) =>
                    row.map((cell, xi) => (xi === x && yi === y ? {...cell, object: selectedObjectNumber} : cell)),
                ),
            });
        } else if (type !== 'cell' && selectedTextureNumber && !(type === 'vWall' && x >= 31)) {
            const newMap = updateWall(map, x, y, type as WallType, selectedTextureNumber, false);
            setMap(newMap);
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
                                            {x < 31 && (
                                                <VWall
                                                    texture={map.vWalls[y][x].texture}
                                                    mirror={map.vWalls[y][x].mirror}
                                                    onMouseDown={handleMouseDown(x, y, 'vWall')}
                                                    onMouseEnter={handleMouseEnter(x, y, 'vWall')}
                                                />
                                            )}
                                            <Cell
                                                object={map.cells[y][x].object ?? null}
                                                onMouseDown={handleMouseDown(x, y, 'cell')}
                                                onMouseEnter={handleMouseEnter(x, y, 'cell')}
                                            />
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