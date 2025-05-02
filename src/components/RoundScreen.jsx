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
    currentRound,
    updateGameState,
    nextState
  } = useGame();
  const [roundMoves, setRoundMoves] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const renderDebugInfo = () => (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs">
      <button onClick={toggleDebug} className="mb-2 text-white">Close Debug</button>
      <pre>
        {JSON.stringify({
          gameState,
          selectedMove,
          selectedModifier,
          koCount,
          guessedCorrectly,
          currentRound
        }, null, 2)}
      </pre>
    </div>
  );

  useEffect(() => {
    // Select 3 random moves for the round
    const shuffled = [...moves].sort(() => 0.5 - Math.random());
    setRoundMoves(shuffled.slice(0, 3));
  }, [moves, currentRound]);

  const handleMoveSelect = (move) => {
    updateGameState({ selectedMove: move });
    nextState();
  };

  const handleModifierSelect = (modifier) => {
    updateGameState({ selectedModifier: modifier });
    nextState();
  };

  const handleSkipModifier = () => {
    // First clear the modifier
    updateGameState({ selectedModifier: null });
    // Then transition to the next state
    nextState();
  };

  const handleKoChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    updateGameState({ koCount: value });
  };

  const handleKoIncrement = () => {
    updateGameState({ koCount: koCount + 1 });
  };

  const handleKoDecrement = () => {
    if (koCount > 0) {
      updateGameState({ koCount: koCount - 1 });
    }
  };

  const handleGuessToggle = () => {
    updateGameState({ guessedCorrectly: !guessedCorrectly });
  };

  const handleFinish = () => {
    // Calculate score based on selected move, modifier, KO count, and guess
    const movePoints = selectedMove ? selectedMove.points : 0;
    const modifierBonus = selectedModifier ? selectedModifier.bonus : 0;
    const guessBonus = guessedCorrectly ? 2 : 0;
    const roundScore = (movePoints + modifierBonus) * koCount + guessBonus;
    updateGameState({ roundScore, gameState: 'score' });
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
                : 'bg-blue-500/30 hover:bg-blue-500/40'
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
      <div className="mb-4 p-3 bg-white/10 rounded-lg flex justify-between">
        <p className="text-lg font-semibold">Selected Move:</p>
        <p className="text-xl">{selectedMove.name} ({selectedMove.points} points)</p>
      </div>
      <div className="space-y-2">
        {modifiers.map((modifier) => (
          <button
            key={modifier.id}
            onClick={() => handleModifierSelect(modifier)}
            className={`w-full p-2 rounded-lg ${
              selectedModifier && selectedModifier.id === modifier.id
                ? 'bg-purple-500 text-white'
                : 'bg-purple-500/30 hover:bg-purple-500/40'
            }`}
          >
            {modifier.name} (+{modifier.bonus} points)
          </button>
        ))}
        <button
          onClick={handleSkipModifier}
          className="w-full p-2 rounded-lg bg-gray-500/30 hover:bg-gray-500/40 mt-4"
        >
          Skip Modifier
        </button>
      </div>
    </div>
  );

  const renderKoInput = () => {
    const movePoints = selectedMove ? selectedMove.points : 0;
    const modifierBonus = selectedModifier ? selectedModifier.bonus : 0;
    const guessBonus = guessedCorrectly ? 2 : 0;
    const roundScore = (movePoints + modifierBonus) * koCount + guessBonus;

    return (
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30">
        <h2 className="text-2xl font-bold mb-4">Enter KOs</h2>
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <p className="text-lg font-semibold">Selected Move:</p>
          <p className="text-xl">{selectedMove.name} ({selectedMove.points} points)</p>
          {selectedModifier && (
            <p className="text-xl">+ {selectedModifier.name} (+{selectedModifier.bonus} points)</p>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-lg">Number of KOs:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleKoDecrement}
                className="w-12 h-12 bg-red-500/60 rounded-lg flex items-center justify-center text-2xl font-bold hover:bg-red-500/80 disabled:opacity-50 disabled:cursor-not-allowed pressed:bg-red-500/80"
                disabled={koCount === 0}
              >
                -
              </button>
              <input
                type="number"
                value={koCount}
                onChange={handleKoChange}
                className="flex-1 h-12 p-2 rounded-lg bg-white/30 text-center text-xl"
                min="0"
              />
              <button
                onClick={handleKoIncrement}
                className="w-12 h-12 bg-green-500/60 rounded-lg flex items-center justify-center text-2xl font-bold hover:bg-green-500/80 pressed:bg-green-500/80"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg flex-col">
            <input
              type="checkbox"
              checked={guessedCorrectly}
              onChange={handleGuessToggle}
              className="w-12 h-12 rounded-md border-2 border-white/30 checked:bg-purple-500 accent-purple-500"
            />
            <label className="text-lg">Correctly guessed another player's move</label>
          </div>
          <div className="mt-4 p-3 bg-white/10 rounded-lg flex justify-between">
            <p className="text-lg font-semibold">Score Preview:</p>
            <p className="text-xl">{roundScore} points</p>
          </div>
          <button
            onClick={handleFinish}
            className="mt-6 w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 text-lg font-semibold"
          >
            Finish Round
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {showDebug && renderDebugInfo()}
      <button 
        onClick={toggleDebug}
        className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs"
      >
        Debug State
      </button>
      {gameState === 'moveSelection' && renderMoveSelection()}
      {gameState === 'modifierSelection' && renderModifierSelection()}
      {gameState === 'koInput' && renderKoInput()}
    </>
  );
};

export default RoundScreen; 