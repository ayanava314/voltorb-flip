import { useState, useEffect } from "react";

const GRID_SIZE = 5;

function generateBoard(level = 1) {
  const board = [];
  const totalTiles = GRID_SIZE * GRID_SIZE;
  const voltorbCount = Math.min(6 + level, totalTiles - 5);

  const flatTiles = Array(totalTiles).fill({ value: 1, flipped: false, marked: false });

  let voltorbsPlaced = 0;
  while (voltorbsPlaced < voltorbCount) {
    const idx = Math.floor(Math.random() * totalTiles);
    if (flatTiles[idx].value !== 'V') {
      flatTiles[idx] = { value: 'V', flipped: false, marked: false };
      voltorbsPlaced++;
    }
  }

  const bonusTiles = Math.min(level + 5, totalTiles - voltorbCount);
  let placed = 0;
  while (placed < bonusTiles) {
    const idx = Math.floor(Math.random() * totalTiles);
    if (flatTiles[idx].value === 1) {
      const val = Math.random() < 0.5 ? 2 : 3;
      flatTiles[idx] = { value: val, flipped: false, marked: false };
      placed++;
    }
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    const row = flatTiles.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE);
    board.push(row);
  }
  return board;
}

function calculateClues(board) {
  const rowClues = board.map(row => {
    const voltorbs = row.filter(t => t.value === 'V').length;
    const sum = row.reduce((acc, t) => acc + (t.value === 'V' ? 0 : t.value), 0);
    return { voltorbs, sum };
  });

  const colClues = [];
  for (let j = 0; j < GRID_SIZE; j++) {
    let voltorbs = 0, sum = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      const tile = board[i][j];
      if (tile.value === 'V') voltorbs++;
      else sum += tile.value;
    }
    colClues.push({ voltorbs, sum });
  }

  return { rowClues, colClues };
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState(() => generateBoard(level));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(1);
  const [highScore, setHighScore] = useState(1);
  const [clues, setClues] = useState(() => calculateClues(board));

  const flipTile = (i, j) => {
    if (gameOver || board[i][j].flipped || board[i][j].marked) return;
    const newBoard = board.map(row => row.map(tile => ({ ...tile })));
    const tile = newBoard[i][j];
    tile.flipped = true;

    if (tile.value === 'V') {
      setGameOver(true);
      alert("Voltorb! Game Over.");
    } else {
      const newScore = score * tile.value;
      setScore(newScore);
      if (newScore > highScore) setHighScore(newScore);

      const allBonusFlipped = newBoard.flat().every(t =>
        t.value === 'V' || t.value === 1 || t.flipped
      );

      if (allBonusFlipped) {
        alert("You win! Advancing to next level.");
        const nextLevel = level + 1;
        const newBoard = generateBoard(nextLevel);
        setLevel(nextLevel);
        setBoard(newBoard);
        setScore(1);
        setClues(calculateClues(newBoard));
        setGameOver(false);
        return;
      }
    }
    setBoard(newBoard);
  };

  const markTile
