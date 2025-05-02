import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const sampleMoves = [
  // High points (Tilts, Throws)
  { id: 1, name: 'Up Tilt', points: 3, type: 'ground' },
  { id: 2, name: 'Down Tilt', points: 3, type: 'ground' },
  { id: 3, name: 'Forward Tilt', points: 3, type: 'ground' },
  { id: 4, name: 'Back Throw', points: 3, type: 'throw' },
  { id: 5, name: 'Up Throw', points: 3, type: 'throw' },
  { id: 6, name: 'Down Throw', points: 3, type: 'throw' },
  { id: 7, name: 'Forward Throw', points: 3, type: 'throw' },
  
  // Medium points (Aerials, Specials)
  { id: 8, name: 'Neutral Air', points: 2, type: 'aerial' },
  { id: 9, name: 'Forward Air', points: 2, type: 'aerial' },
  { id: 10, name: 'Back Air', points: 2, type: 'aerial' },
  { id: 11, name: 'Up Air', points: 2, type: 'aerial' },
  { id: 12, name: 'Down Air', points: 2, type: 'aerial' },
  { id: 13, name: 'Neutral Special', points: 2, type: 'special' },
  { id: 14, name: 'Side Special', points: 2, type: 'special' },
  { id: 15, name: 'Up Special', points: 2, type: 'special' },
  { id: 16, name: 'Down Special', points: 2, type: 'special' },
  
  // Low points (Smash Attacks)
  { id: 17, name: 'Forward Smash', points: 1, type: 'smash' },
  { id: 18, name: 'Up Smash', points: 1, type: 'smash' },
  { id: 19, name: 'Down Smash', points: 1, type: 'smash' },
];

const allModifiers = [
  // Aerial-specific modifiers
  { id: 1, name: 'Spike', bonus: 3, allowedTypes: ['aerial'] },
  { id: 2, name: 'Reversed', bonus: 2, allowedTypes: ['aerial', 'special'] },
  { id: 3, name: 'Projectile', bonus: 2, allowedTypes: ['aerial', 'special'] },
  
  // Special-specific modifiers
  { id: 4, name: 'Fully Charged', bonus: 2, allowedTypes: ['special', 'smash'] },
  { id: 5, name: 'KO Punch', bonus: 4, allowedTypes: ['special'] },
  { id: 7, name: 'Counter', bonus: 4, allowedTypes: ['special'] },
  
  // Universal modifiers
  { id: 6, name: 'Reflect', bonus: 2, allowedTypes: ['aerial', 'ground', 'special', 'smash'] },
];

export const GameProvider = ({ children }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [moves, setMoves] = useState(sampleMoves);
  const [modifiers, setModifiers] = useState([]);
  const [selectedMove, setSelectedMove] = useState(null);
  const [selectedModifier, setSelectedModifier] = useState(null);
  const [koCount, setKoCount] = useState(0);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameState, setGameState] = useState('moveSelection');

  const getApplicableModifiers = (move) => {
    if (!move) return [];
    return allModifiers
      .filter(modifier => modifier.allowedTypes.includes(move.type))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  const updateGameState = (newState) => {
    setCurrentRound(newState.currentRound || currentRound);
    setMoves(newState.moves || moves);
    setSelectedMove(newState.selectedMove || selectedMove);
    setSelectedModifier(newState.selectedModifier !== undefined ? newState.selectedModifier : selectedModifier);
    setKoCount(newState.koCount || koCount);
    setGuessedCorrectly(newState.guessedCorrectly !== undefined ? newState.guessedCorrectly : guessedCorrectly);
    if (newState.roundScore !== undefined) {
      setRoundScore(newState.roundScore);
      setTotalScore(prevTotal => prevTotal + newState.roundScore);
    }
    if (newState.gameState) {
      setGameState(newState.gameState);
    }
    if (newState.selectedMove) {
      setModifiers(getApplicableModifiers(newState.selectedMove));
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
      roundScore,
      totalScore,
      gameState,
      updateGameState,
      nextState,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 