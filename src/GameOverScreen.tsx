import React from 'react';
import './GameOverScreen.css';

interface GameOverScreenProps {
    onRestart: () => void;
    highScore?: number;
    onEndGame?: () => void;
}

export function GameOverScreen({ onRestart, highScore, onEndGame }: Readonly<GameOverScreenProps>) {
    return (
        <div className="game-over-overlay">
            <p>GAME OVER!</p>
            <button onClick={() => {
                const stored = localStorage.getItem('2048_high_score');
                const storedVal = stored ? Number.parseInt(stored, 10) : 0;
                const toSave = Math.max(storedVal, highScore);
                localStorage.setItem('2048_high_score', toSave.toString());
                onEndGame();
            }}>Restart</button>
        </div>
    )
}