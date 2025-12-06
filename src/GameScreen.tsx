import React, { useState, useEffect, useCallback } from 'react';
import './GameScreen.css';
import { Board } from './Board';
import { addRandomTile, checkGameOver, initializeBoardWithTwoTiles, processMove } from './logic';
import { Score } from './Score';
import { useNotification } from './useNotification';
import { TileValue } from './TypesForGame';
import { GameOverScreen } from './GameOverScreen';
export type Board = TileValue[][];
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Property defnition in order to ensure that GameScreen only accepts callbacks
interface GameScreenProps {
    onEndGame: () => void;
}

export function GameScreen({ onEndGame }: Readonly<GameScreenProps>) {
    // State variables for board, score, game over status, notification sent status, and high score
    let [board, setBoard] = useState<Board>(initializeBoardWithTwoTiles());
    let [score, setScore] = useState<number>(0);
    let [isGameOver, setIsGameOver] = useState<boolean>(false);
    let [notificationSent, setNotificationSent] = useState<boolean>(false);
    let { requestAndShowNotification } = useNotification();
    let savedHighScore = localStorage.getItem('2048_high_score');
    let [highScore, setHighScore] = useState<number>(savedHighScore ? Number.parseInt(savedHighScore, 10) : 0);

    // Callback used to move tiles in the specified direction to ensure stable references
    let moveTiles = useCallback((direction: Direction, currentBoard: Board): Board => {

        let { newBoard: movedBoard, scoreGained, moved: wasMoved } = processMove(direction, currentBoard);

        if (wasMoved) {
            setScore(prevScore => {
                const newTotalScore = prevScore + scoreGained;

                setHighScore(prevHighScore => {
                    if (newTotalScore > prevHighScore) {
                        if (!notificationSent) {
                            requestAndShowNotification('New highscore!', {
                                body: `Congratulations!`
                            });
                            setNotificationSent(true);
                        }
                        return newTotalScore;
                    }
                    return prevHighScore;
                });
                return newTotalScore;
            });


            let boardWithNewTile = addRandomTile(movedBoard);

            setIsGameOver(checkGameOver(boardWithNewTile));

            return boardWithNewTile;
        }
        return currentBoard;
    }, [setScore, setIsGameOver, setHighScore, notificationSent, setNotificationSent, requestAndShowNotification]);

    // Hook used to handle keyboard input for moving tiles
    useEffect(() => {
        let handleKeyDown = (event: KeyboardEvent) => {
            let direction: Direction | null = null;
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    direction = 'UP';
                    break;
                case 'ArrowDown':
                case 's':
                    direction = 'DOWN';
                    break;
                case 'ArrowLeft':
                case 'a':
                    direction = 'LEFT';
                    break;
                case 'ArrowRight':
                case 'd':
                    direction = 'RIGHT';
                    break;
            }
            if (direction) {
                event.preventDefault();
                setBoard(prevBoard => moveTiles(direction, prevBoard));
            }
        };

        globalThis.addEventListener('keydown', handleKeyDown);
        return () => {
            globalThis.removeEventListener('keydown', handleKeyDown);
        };
    }, [moveTiles]);

    // Hook used to reset notificationSent when a new game starts
    useEffect(() => {
        setNotificationSent(false);
    }, []);

    // The HTML structure of the GameScreen, Score and End game component
    return (
        <div className="game-screen">
            <Score score={score} highScore={highScore} onEndGame={() => {
                const stored = localStorage.getItem('2048_high_score');
                const storedVal = stored ? Number.parseInt(stored, 10) : 0;
                const toSave = Math.max(storedVal, highScore);
                localStorage.setItem('2048_high_score', toSave.toString());
                onEndGame();
            }} />

            <Board board={board} />

            {isGameOver && (<GameOverScreen onRestart={() => {
                const stored = localStorage.getItem('2048_high_score');
                const storedVal = stored ? Number.parseInt(stored, 10) : 0;
                const toSave = Math.max(storedVal, highScore);
                localStorage.setItem('2048_high_score', toSave.toString());
                onEndGame();
            }} />)}
        </div>
    );
}