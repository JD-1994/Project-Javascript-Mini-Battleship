// Requirements: Part 2
// Only go to this step when you have successfully finished part 1.

// Now we are going to make the game a little more realistic.

// Rewrite the code so that we use letters A-J and numbers 1-10. This will create a 100 unit grid.
// If you haven't already, create a function that builds the grid. This function will take a single number argument to build the grid accordingly. (i.e. buildGrid(3) will create a 3x3 grid (9 units), buildGrid(5) will create a 5x5 grid (25 units) buildGrid(10) creates a 10x10 (100 units), etc). 
// The computer will now place multiple ships in this format:
// One two-unit ship
// Two three-unit ships
// One four-unit ship
// One five-unit ship
// Keep in mind that your code cannot place two ships on intersecting paths
// Ship placement should be random (horizontally and vertically placed) and not manually placed by you in the code
// Ships must be placed within the grid boundaries
// The game works as before, except now, all ships must be destroyed to win
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const boardSize = 10;
const alphabet = 'ABCDEFGHIJ'.split('');
let grid = [];
let ships = [];
let attempts = [];
let totalHitsNeeded = 0;
let hits = 0;

const shipConfigs = [
  { name: 'two-unit ship', size: 2, count: 1 },
  { name: 'three-unit ship', size: 3, count: 2 },
  { name: 'four-unit ship', size: 4, count: 1 },
  { name: 'five-unit ship', size: 5, count: 1 }
];

function startGame() {
  console.clear();
  console.log("Press 'Enter' to start the game.");
  rl.question('', () => {
    buildGrid(boardSize);
    placeShips();
    console.table(grid);
    playGame();
  });
}

function buildGrid(size) {
  grid = Array.from({ length: size }, () => Array(size).fill(0));
}

function placeShips() {
  ships = [];
  totalHitsNeeded = 0;
  for (const config of shipConfigs) {
    for (let i = 0; i < config.count; i++) {
      placeShip(config.size);
      totalHitsNeeded += config.size;
    }
  }
  attempts = [];
  hits = 0;
}

function isPlacementValid(row, col, size, isHorizontal) {
  if (isHorizontal) {
    if (col + size > boardSize) return false;
    for (let i = 0; i < size; i++) {
      if (grid[row][col + i] !== 0) return false;
    }
  } else {
    if (row + size > boardSize) return false;
    for (let i = 0; i < size; i++) {
      if (grid[row + i][col] !== 0) return false;
    }
  }
  return true;
}

function setShip(row, col, size, isHorizontal) {
  for (let i = 0; i < size; i++) {
    if (isHorizontal) {
      grid[row][col + i] = 1;
      ships.push(alphabet[row] + (col + i + 1));
    } else {
      grid[row + i][col] = 1;
      ships.push(alphabet[row + i] + (col + 1));
    }
  }
}

function placeShip(size) {
  while (true) {
    const isHorizontal = Math.random() < 0.5;
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    if (isPlacementValid(row, col, size, isHorizontal)) {
      setShip(row, col, size, isHorizontal);
      break;
    }
  }
}

function restartGame() {
  console.log("You have destroyed all battleships. Would you like to play again? Y/N");
  rl.question('', (answer) => {
    if (answer.toUpperCase() === 'Y') {
      startGame();
    } else {
      console.log("Thanks for playing!");
      rl.close();
    }
  });
}

function playGame() {
  rl.question("Enter a location to strike, e.g., 'A2': ", (input) => {
    input = input.toUpperCase();
    console.table(grid);
    if (!isValidInput(input)) {
      console.log("Invalid input. Try again.");
    } else if (attempts.includes(input)) {
      console.log("You have already picked this location. Miss!");
    } else {
      attempts.push(input);
      if (ships.includes(input)) {
        hits++;
        console.log(`Hit. You have sunk part of a battleship. ${totalHitsNeeded - hits} hit(s) remaining.`);
        ships = ships.filter(ship => ship !== input);
        if (hits === totalHitsNeeded) {
          restartGame();
          return;
        }
      } else {
        console.log("You have missed!");
      }
    }
    playGame();
  });
}

function isValidInput(input) {
  if (input.length < 2 || input.length > 3) return false;

  const row = input[0];
  const col = input.slice(1);

  if (!alphabet.includes(row)) return false;
  if (isNaN(col) || col < 1 || col > boardSize) return false;

  return true;
}

startGame();
