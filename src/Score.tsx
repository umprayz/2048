import './Score.css';

// The Score component displays the current score, high score, and an exit button
// These are given as props to the component
export function Score({ score, highScore, onEndGame }:
Readonly<{ score: number; highScore: number; onEndGame:
() => void }>) {
    return (<div className="score-header">
        <h2 className="highscore">Highest Score: {highScore}</h2>
        <h2 className="score">Score: {score}</h2>
        <button onClick={onEndGame}>Exit</button>
    </div>);
}