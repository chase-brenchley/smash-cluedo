import React from 'react';
import { useGame } from '../context/GameContext';

const ScoreScreen = () => {
  const { 
    roundScore,
    totalScore,
    currentRound, 
    updateGameState, 
    gameState,
    selectedMove,
    selectedModifier,
    koCount,
    guessedCorrectly
  } = useGame();

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

  const movePoints = selectedMove ? selectedMove.points : 0;
  const modifierBonus = selectedModifier ? selectedModifier.bonus : 0;
  const guessBonus = guessedCorrectly ? 2 : 0;

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30">
      <h2 className="text-2xl font-bold mb-4">Score Screen</h2>
      <div className="space-y-4">
        <div className="p-3 bg-white/10 rounded-lg">
          <p className="text-lg font-semibold">Round Summary:</p>
          <p className="text-xl">{selectedMove.name} ({selectedMove.points} points)</p>
          {selectedModifier && (
            <p className="text-xl">+ {selectedModifier.name} (+{selectedModifier.bonus} points)</p>
          )}
          <p className="text-xl">× {koCount} KOs</p>
          {guessedCorrectly && (
            <p className="text-xl">+ 2 points (Correct Guess)</p>
          )}
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <p className="text-lg font-semibold">Round Score: {roundScore} points</p>
          <p className="text-lg font-semibold">Total Score: {totalScore} points</p>
          <p className="text-lg">Round: {currentRound}</p>
        </div>
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