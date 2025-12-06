import React from 'react';
import './Tile.css';

// Property definition for Tile component, so that it only accepts a number
interface TileProps {
  value: number;
}

// Tile component to represent each tile on the board
// Tile cannot change its value after creation
export function Tile({ value }: Readonly<TileProps>) {
    let tileClassName = `tile tile-${value}`;
    let displayValue = value > 0 ? value : '';
    return (
        <div className={tileClassName}>
        {displayValue}
        </div>
    );
}
