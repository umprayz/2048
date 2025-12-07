import { useState, useEffect } from 'preact/hooks';
import { StartScreen } from './StartScreen';
import { GameScreen } from './GameScreen';

// Type definition for current view
type View = 'start' | 'game';

// App component
// Decides which screen to show based on the current view type
export function App(){
  let [currentView, setCurrentView] = useState<View>('start');

  // Initialize localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let highScoreValue = localStorage.getItem('2048_high_score');
      if (highScoreValue === 'NaN' || highScoreValue === null || highScoreValue === '') {
        localStorage.setItem('2048_high_score', '0');
      }
    }
  }, []);

  let handleStartGame = () => {
    setCurrentView('game');
  };

  let handleEndGame = () => {
    setCurrentView('start');
  };

  // Render the appropriate screen based on current view
  return (
    <div className="app-container">
      {currentView === 'start' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      
      {currentView === 'game' && (
        <GameScreen onEndGame={handleEndGame} />
      )}
    </div>
  );
}