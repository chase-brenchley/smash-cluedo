import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const RoundScreen = () => {
  const { 
    moves, 
    modifiers, 
    selectedMove, 
    selectedModifier, 
    koCount, 
    guessedCorrectly, 
    gameState,
    updateGameState,
    nextState
  } = useGame();
  const [roundMoves, setRoundMoves] = useState([]);

  useEffect(() => {
    // Select 3 random moves for the round
    const shuffled = [...moves].sort(() => 0.5 - Math.random());
    setRoundMoves(shuffled.slice(0, 3));
  }, [moves]);

  const handleMoveSelect = (move) => {
    updateGameState({ selectedMove: move });
    nextState();
  };

  const handleModifierSelect = (modifier) => {
    updateGameState({ selectedModifier: modifier });
    nextState();
  };

  const handleSkipModifier = () => {
    nextState();
  };

  const handleKoChange = (e) => {
    updateGameState({ koCount: parseInt(e.target.value) || 0 });
  };

  const handleGuessToggle = () => {
    updateGameState({ guessedCorrectly: !guessedCorrectly });
  };

  const handleFinish = () => {
    // Calculate score based on selected move, modifier, KO count, and guess
    const movePoints = selectedMove ? selectedMove.points : 0;
    const modifierMultiplier = selectedModifier ? selectedModifier.multiplier : 1;
    const guessBonus = guessedCorrectly ? 2 : 0;
    const totalScore = (movePoints * modifierMultiplier * koCount) + guessBonus;
    updateGameState({ score: totalScore, gameState: 'score' });
  };

  const renderMoveSelection = () => (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30">
      <h2 className="text-2xl font-bold mb-4">Select Your Move</h2>
      <div className="space-y-4">
        {roundMoves.map((move) => (
          <button
            key={move.id}
            onClick={() => handleMoveSelect(move)}
            className={`w-full p-3 rounded-lg ${
              selectedMove && selectedMove.id === move.id
                ? 'bg-blue-500 text-white'
                : 'bg-white/30 hover:bg-white/40'
            }`}
          >
            {move.name} ({move.points} points)
          </button>
        ))}
      </div>
    </div>
  );

  const renderModifierSelection = () => (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30">
      <h2 className="text-2xl font-bold mb-4">Optional Modifier</h2>
      <div className="space-y-2">
        {modifiers.map((modifier) => (
          <button
            key={modifier.id}
            onClick={() => handleModifierSelect(modifier)}
            className={`w-full p-2 rounded-lg ${
              selectedModifier && selectedModifier.id === modifier.id
                ? 'bg-green-500 text-white'
                : 'bg-white/30 hover:bg-white/40'
            }`}
          >
            {modifier.name} (x{modifier.multiplier})
          </button>
        ))}
        <button
          onClick={handleSkipModifier}
          className="w-full p-2 rounded-lg bg-white/30 hover:bg-white/40 mt-4"
        >
          Skip Modifier
        </button>
      </div>
    </div>
  );

  const renderKoInput = () => (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30">
      <h2 className="text-2xl font-bold mb-4">Enter KOs</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Number of KOs:</label>
          <input
            type="number"
            value={koCount}
            onChange={handleKoChange}
            className="w-full p-2 rounded-lg bg-white/30"
            min="0"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={guessedCorrectly}
              onChange={handleGuessToggle}
              className="mr-2"
            />
            Correctly guessed another player's move
          </label>
        </div>
        <button
          onClick={handleFinish}
          className="mt-6 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
        >
          Finish Round
        </button>
      </div>
    </div>
  );

  switch (gameState) {
    case 'moveSelection':
      return renderMoveSelection();
    case 'modifierSelection':
      return renderModifierSelection();
    case 'koInput':
      return renderKoInput();
    default:
      return null;
  }
};

export default RoundScreen; 