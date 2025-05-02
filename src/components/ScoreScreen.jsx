import React from 'react';
import { useGame } from '../context/GameContext';

const ScoreScreen = () => {
  const { score, currentRound, updateGameState, gameState } = useGame();

  const handleReady = () => {
    updateGameState({
      currentRound: currentRound + 1,
      selectedMove: null,
      selectedModifier: null,
      koCount: 0,
      guessedCorrectly: false,
      gameState: 'moveSelection'
    });
  };

  if (gameState !== 'score') {
    return null;
  }

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30">
      <h2 className="text-2xl font-bold mb-4">Score Screen</h2>
      <div className="space-y-2">
        <p>Total Score: {score}</p>
        <p>Round: {currentRound}</p>
      </div>
      <button
        onClick={handleReady}
        className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        Ready for Next Round
      </button>
    </div>
  );
};

export default ScoreScreen; 