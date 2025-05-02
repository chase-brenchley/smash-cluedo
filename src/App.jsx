import React from 'react';
import { GameProvider } from './context/GameContext';
import RoundScreen from './components/RoundScreen';
import ScoreScreen from './components/ScoreScreen';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RoundScreen />
          <ScoreScreen />
        </div>
      </div>
    </GameProvider>
  );
}

export default App; 