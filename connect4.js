/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const myGameInstances = []; //manage game instances here
const currentGameInstance = myGameInstances[0] || null; 
let currentPlayerInCurrentInstance = isThereAGameChecker() ? currentGameInstance.currPlayer : null;
let playerOne = isThereAGameChecker() ? currentGameInstance.playersArr[currentGameInstance.playersArr.indexOf('PlayerOne')] : null; //assign this to instance of player 1 running currently
let playerTwo = isThereAGameChecker() ? currentGameInstance.playersArr[currentGameInstance.playersArr.indexOf('PlayerTwo')] : null; //assign this to instance of player 2 running currently

class ConnectFourGame{
  constructor (WIDTH, HEIGHT){
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.currPlayer = []; // active player: 1 or 2 
    this.playersArr = [] //add new players here 
    this.board = this.makeBoard() // array of rows, each row is array of cells  (board[y][x])
    this.makeHtmlBoard();
    this.gameOver = false;
    this.element = document.querySelector('table#board')
    myGameInstances.push(this)
  } 
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  
  makeBoard = () => {
    let blankBoard = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      blankBoard.push(Array.from({ length: this.WIDTH }));
    }
    return blankBoard
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  
  makeHtmlBoard = () => {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click',evt => {
      this.handleClick(evt)
    })
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

/** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol = x => {
  for (let y = this.HEIGHT - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable = (y, x) => {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${this.currPlayer.playerName}`); //add name of player who added piece
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

endGame(msg) {
  this.gameOver = true;
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

handleClick = evt => { //standard function -> this is now the html element that was clicked
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // switch players
  this.currPlayer = this.currPlayer === playersArr[0] ? playersArr[1] : playersArr[0];

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.gameOver ? alert ('Game is over!'): this.placeInTable(y, x);
  
  // check for win
  if (this.checkForWin()) {
    return this.endGame(`Player ${this.currPlayer} won!`);
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin = () => {
  const _win = cells => {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer
    );
  }
  for (let y = 0; y < this.HEIGHT; y++) {
    for (let x = 0; x < this.WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
}//end of ConnectFourGame class

//Part 2: Small Improvements - start/restart game button, no more clicking once game done
const startGameButton = document.getElementById('game-start-button')
startGameButton.addEventListener('click', (e) => {
  isThereAGameChecker() ? resetGame() : new ConnectFourGame(7,6);
})

const resetGame = () => {
  const pieceDOMList = document.querySelectorAll('td > div.piece')
  pieceDOMList.forEach(piece => piece.remove())
  currentGameInstance.board = currentGameInstance.makeBoard();
}

const isThereAGameChecker = () => {
  return currentGameInstance ? true : false; 
}


//Part 3: Player class & color input
class Player {
  constructor (playerName, playerColor){
    this.playerName = playerName;
    this.playerColor = playerColor;
    playersArr.push(this)
  }
  get nameAndColor () {
    return `${this.playerName}: ${this.playerColor}`
  }
}

class PlayerOne extends Player {
  constructor(playerName,playerColor){
    this.playerOrder = 1;
    super(playerName,playerColor)
  }
  set playerOneNameSetter(playerName) {
    if (typeof playerName === 'string'){
      this.playerName = playerName;
    }
    else {
      this.playerName = '1'
      return 
    }
  }
  set playerOneColorSetter(playerColor){
    if (typeof this.playerColor === 'string'){
      this.playerColor = playerColor;
    }
    else {
      this.playerColor = 'red'
    }
  }
}

class PlayerTwo extends Player {
  constructor(playerName,playerColor){
    this.playerOrder = 2;
    super(playerName,playerColor)
  }
  set playerTwoNameSetter(playerName) {
    if (typeof playerName === 'string'){
      this.playerName = playerName;
    }
    else {
      this.playerName = '2'
      return 
    }
  }
  set playerTwoColorSetter(playerColor){
    if (typeof this.playerColor === 'string'){
      this.playerColor = playerColor;
    }
    else {
      this.playerColor = 'blue'
    }
  }
}

const arrayToggler = array => {
  [array[0],array[1]] = [array[1], array[0]]
}

const getFormValuesAndMakeNewPlayers = () => {
  let p1Name = document.querySelector('input#playerOneName').value;
  let p1Color = document.querySelector('input#playerOneColor').value;
  
  let p2Name = document.querySelector('input#playerTwoName').value
  let p2Color = document.querySelector('input#playerTwoColor').value

  const newplayerOne = new PlayerOne(p1Name, p1Name)
  const newPlayerTwo = new PlayerTwo(p2Name, p2Color)

  currentGameInstance.currPlayer.push(newplayerOne, newPlayerTwo) 
  return 
}