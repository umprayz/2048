import React from 'react';
import { Tile } from './Tile';
import './GameBoard.css';

// Property definition for Board component, so that it only accepts a 2D array of numbers
interface BoardProps {
  board: number[][];
}

// GameBoard component to render the game board
export function GameBoard({ board }: Readonly<BoardProps>) {
    return (
    <div className="game-board-container">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((value, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              value={value}
            />
          ))}
        </div>
      ))}
    </div>
  );
}