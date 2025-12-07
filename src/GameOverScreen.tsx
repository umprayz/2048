import React from 'react';
import './GameOverScreen.css';

interface GameOverScreenProps {
    onRestart: () => void;
}

export function GameOverScreen({ onRestart }: Readonly<GameOverScreenProps>) {
    return (
        <div className="game-over-overlay">
            <p>GAME OVER!</p>
            <button onClick={onRestart}>
                Restart
            </button>
        </div>
    )
}