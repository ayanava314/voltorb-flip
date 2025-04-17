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

  const markTile = (e, i, j) => {
    e.preventDefault();
    if (gameOver || board[i][j].flipped) return;
    const newBoard = board.map(row => row.map(tile => ({ ...tile })));
    newBoard[i][j].marked = !newBoard[i][j].marked;
    setBoard(newBoard);
  };

  const resetGame = () => {
    const newBoard = generateBoard(level);
    setBoard(newBoard);
    setScore(1);
    setGameOver(false);
    setClues(calculateClues(newBoard));
  };

  const handleLevelSelect = (e) => {
    const selectedLevel = parseInt(e.target.value);
    const newBoard = generateBoard(selectedLevel);
    setLevel(selectedLevel);
    setBoard(newBoard);
    setScore(1);
    setGameOver(false);
    setClues(calculateClues(newBoard));
  };

  return (
  <div className="p-4 text-center">
    <h1 className="text-2xl font-bold mb-2">Voltorb Flip</h1>
    <p className="mb-1">Level: {level}</p>
    <p className="mb-1">Score: {score}</p>
    <p className="mb-2">High Score: {highScore}</p>

    <div className="mb-2">
      <label htmlFor="levelSelect" className="mr-2 font-medium">Select Level:</label>
      <select
        id="levelSelect"
        value={level}
        onChange={handleLevelSelect}
        className="border rounded px-2 py-1"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map(lvl => (
          <option key={lvl} value={lvl}>Level {lvl}</option>
        ))}
      </select>
    </div>

    <div className="inline-block">
      <div className="grid grid-cols-6 gap-1 mb-2">
        {/* Top-left empty cell */}
        <div className="w-16 h-16" />

        {/* Column clues */}
        {clues.colClues.map((clue, idx) => (
          <div
            key={`col-clue-${idx}`}
            className="w-16 h-16 bg-yellow-200 rounded p-1 text-xs font-semibold flex flex-col items-center justify-center"
          >
            <div>Sum: {clue.sum}</div>
            <div>V: {clue.voltorbs}</div>
          </div>
        ))}

        {/* Board rows with row clues at start */}
        {board.map((row, i) => (
          <React.Fragment key={`row-${i}`}>
            {/* Row clue */}
            <div
              className="w-16 h-16 bg-yellow-200 rounded p-1 text-xs font-semibold flex flex-col items-center justify-center"
            >
              <div>Sum: {clues.rowClues[i].sum}</div>
              <div>V: {clues.rowClues[i].voltorbs}</div>
            </div>

            {/* Row tiles */}
            {row.map((tile, j) => (
              <button
                key={`${i}-${j}`}
                className={`w-16 h-16 text-xl font-bold rounded relative ${
                  tile.flipped ? "bg-white border border-gray-400" : "bg-blue-500 text-white"
                }`}
                onClick={() => flipTile(i, j)}
                onContextMenu={(e) => markTile(e, i, j)}
              >
                {tile.flipped ? tile.value : tile.marked ? "V?" : "?"}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>

    <button
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      onClick={resetGame}
    >
      Reset Level
    </button>
    <p className="mt-2 text-sm text-gray-600">Right-click to mark suspected Voltorbs</p>
  </div>
);
}
