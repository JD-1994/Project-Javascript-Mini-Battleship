// Requirements: Part 1
// When the application loads, print the text, "Press any key to start the game."
// When the user presses the key, your code will randomly place two different ships in two separate locations on the board. Each ship is only 1 unit long (In the real game ships are 2+ in length).
// The prompt will then say, "Enter a location to strike ie 'A2' "
// The user will then enter a location. If there is a ship at that location the prompt will read, "Hit. You have sunk a battleship. 1 ship remaining."
// If there is not a ship at that location the prompt will read, "You have missed!"
// If you enter a location you have already guessed the prompt will read, "You have already picked this location. Miss!"
// When both of the battleships have been destroyed the prompt will read, "You have destroyed all battleships. Would you like to play again? Y/N"
// If "Y" is selected the game starts over. If "N" then the application ends itself.
const rl = require('readline-sync');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const boardSize = 3;
const alphabet = ['A', 'B', 'C'];
let ships = [];
let attempts = [];
let hits = 0;
const fleetSize= 2;

function startGame(fleetSize) {
  console.clear();
    rl.keyInPause("Press 'Enter' to start the game.");
    placeShips(fleetSize);
    playGame(fleetSize);
  
}

function placeShips(fleetSize) {
  ships = [];
  while (ships.length < fleetSize) {
    let row = Math.floor(Math.random() * boardSize);
    let col = Math.floor(Math.random() * boardSize);
    let position = alphabet[row] + (col + 1);

    if (!ships.includes(position)) {
      ships.push(position);
    }
  }
 
}

const restartGame = (fleetSize) => {
      
    const answer = rl.keyInYNStrict("You have destroyed all battleships. Would you like to play again? Y/N");
    if (answer) {
        attempts = [];
        hits = 0;
      return startGame(fleetSize);
    } else {
      console.log("Thanks for playing!");
      process.exit();
    }
  
  return;
}


function playGame(fleetSize) {
    const input = rl.question("Enter a location to strike ie 'A2': ");
 

    if (!isValidInput(input)) {
      console.log("Invalid input. Try again.");
    } else if (attempts.includes(input)) {
      console.log("You have already picked this location. Miss!");
    } else {
      attempts.push(input);
      if (ships.includes(input)) {
        hits++;
        console.log(`Hit. You have sunk a battleship. ${2 - hits} ship(s) remaining.`);
        if (hits === fleetSize) {
        restartGame(fleetSize)
        }
       else {
        console.log("You have missed!");
      }
    }
    playGame(fleetSize);
  }


function isValidInput(input) {
  if (input.length !== 2) return false;

  let row = input[0];
  let col = input[1];

  if (!alphabet.includes(row)) return false;
  if (isNaN(col) || col < 1 || col > boardSize) return false;

  return true;
}

startGame(fleetSize);
}