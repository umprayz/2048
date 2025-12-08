import React from 'react';
import './GameOverScreen.css';

interface GameOverScreenProps {
    onRestart: () => void;
}

// returns a Game Over screen with a restart button
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