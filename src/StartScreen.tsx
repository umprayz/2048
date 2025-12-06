import React, { useEffect, useState } from 'react';
import './StartScreen.css';

// Property defnition in order to ensure that StartScreen only accepts callbacks
interface StartScreenProps {
    onStartGame: () => void;
}

// StartScreen component
export function StartScreen({ onStartGame }: Readonly<StartScreenProps>) {
    let [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
    let savedHighScore = localStorage.getItem('2048_high_score');
    let highScore = savedHighScore ? Number.parseInt(savedHighScore, 10) : 0;

    // Load difficulty from localStorage
    useEffect(() => {
        let saved = localStorage.getItem('2048_difficulty') as 'easy' | 'hard' | null;
        if (saved === 'hard' || saved === 'easy') {
            setDifficulty(saved);
        } else {
            localStorage.setItem('2048_difficulty', 'easy');
            setDifficulty('easy');
        }
    }, []);

    // Inner function to toggle difficulty
    let toggleDifficulty = () => {
        let next: 'easy' | 'hard';
        if(difficulty === 'hard') {
            next = 'easy';
        }
        else{
            next = 'hard';
        }
        localStorage.setItem('2048_difficulty', next);
        setDifficulty(next);
    };

    // The HTML structure of the StartScreen component
    return (
        <body id="body">
            <div className="start-screen" id="startscreen">
                <div className="navbar">
                    <text id="themeswitch" onClick={() => document.documentElement.classList.toggle('light-theme')}>Switch theme</text>
                </div>
                <div className="start-screen-content" id="startscreencontent">
                    <h1>2048</h1>
                    <p id="instruction">Use the arrow keys to move the tiles.</p>
                    <p className="highscore-display">Highest Score: {highScore}</p>
                    <button type="button" className="difficultybutton" onClick={toggleDifficulty}>
                        Difficulty: {difficulty}
                    </button>
                    <button type="button" className="newgamebutton" onClick={onStartGame}>
                        Start New Game
                    </button>
                </div>
            </div>
        </body>
    );
}