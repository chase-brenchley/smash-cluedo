import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const sampleMoves = [
  { id: 1, name: 'Up Tilt', points: 3 },
  { id: 2, name: 'Down Air', points: 2 },
  { id: 3, name: 'Forward Smash', points: 1 },
];

const sampleModifiers = [
  { id: 1, name: 'Offstage', multiplier: 1.5 },
  { id: 2, name: 'Fully Charged', multiplier: 1.3 },
  { id: 3, name: 'Reverse', multiplier: 1.2 },
  { id: 4, name: 'Two-in-One', multiplier: 1.4 },
  { id: 5, name: 'Reflect', multiplier: 1.3 },
];

export const GameProvider = ({ children }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [moves, setMoves] = useState(sampleMoves);
  const [modifiers, setModifiers] = useState(sampleModifiers);
  const [selectedMove, setSelectedMove] = useState(null);
  const [selectedModifier, setSelectedModifier] = useState(null);
  const [koCount, setKoCount] = useState(0);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('moveSelection'); // 'moveSelection', 'modifierSelection', 'koInput', 'score'

  const updateGameState = (newState) => {
    setCurrentRound(newState.currentRound || currentRound);
    setMoves(newState.moves || moves);
    setModifiers(newState.modifiers || modifiers);
    setSelectedMove(newState.selectedMove || selectedMove);
    setSelectedModifier(newState.selectedModifier || selectedModifier);
    setKoCount(newState.koCount || koCount);
    setGuessedCorrectly(newState.guessedCorrectly || guessedCorrectly);
    setScore(newState.score || score);
    if (newState.gameState) {
      setGameState(newState.gameState);
    }
  };

  const nextState = () => {
    switch (gameState) {
      case 'moveSelection':
        setGameState('modifierSelection');
        break;
      case 'modifierSelection':
        setGameState('koInput');
        break;
      case 'koInput':
        setGameState('score');
        break;
      default:
        break;
    }
  };

  return (
    <GameContext.Provider value={{
      currentRound,
      moves,
      modifiers,
      selectedMove,
      selectedModifier,
      koCount,
      guessedCorrectly,
      score,
      gameState,
      updateGameState,
      nextState,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 