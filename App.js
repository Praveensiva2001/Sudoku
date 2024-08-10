import React, { useState } from 'react';
import './App.css';

// Initial Sudoku puzzle
const initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
];

function App() {
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));

  // Create a copy of the grid
  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  // Update cell value
  function onInputChange(e, row, col) {
    const value = parseInt(e.target.value) || -1; // Convert to number or use -1
    const grid = getDeepCopy(sudokuArr);
    if (value === -1 || (value >= 1 && value <= 9)) {
      grid[row][col] = value;
    }
    setSudokuArr(grid);
  }

  // Check if number is valid in the current row, column, and 3x3 box
  function isValid(grid, row, col, num) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }

    return true;
  }

  // Recursive function to solve the Sudoku
  function solve(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === -1) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) {
                return true;
              }
              grid[row][col] = -1; // Undo the move
            }
          }
          return false; // No valid number found
        }
      }
    }
    return true; // Puzzle solved
  }

  // Check if Sudoku is valid
  function checkSudoku() {
    function isGridValid(grid) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const num = grid[row][col];
          if (num !== -1 && !isValid(grid, row, col, num)) {
            return false;
          }
        }
      }
      return true;
    }

    const grid = getDeepCopy(sudokuArr);
    if (isGridValid(grid)) {
      alert('Sudoku is valid!');
    } else {
      alert('Sudoku is invalid!');
    }
  }

  // Solve the Sudoku puzzle
  function solveSudoku() {
    const grid = getDeepCopy(sudokuArr);
    if (solve(grid)) {
      setSudokuArr(grid);
      alert('Sudoku solved!');
    } else {
      alert('No solution exists!');
    }
  }

  // Reset the puzzle to the initial state
  function resetSudoku() {
    setSudokuArr(getDeepCopy(initial));
  }

  return (
    <div className="App">
      <div className="App-header">
        <h3>Sudoku Solver</h3>
        <table>
          <tbody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => (
                <tr key={rIndex}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => (
                    <td key={rIndex + cIndex}>
                      <input
                        onChange={(e) => onInputChange(e, row, col)}
                        value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]}
                        className="cellInput"
                        disabled={initial[row][col] !== -1}
                      />
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>

        <div className="buttonContainer">
          <button className="checkButton" onClick={checkSudoku}>Check</button>
          <button className="solveButton" onClick={solveSudoku}>Solve</button>
          <button className="resetButton" onClick={resetSudoku}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
