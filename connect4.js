/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class ConnectFourGame{
  constructor (WIDTH, HEIGHT){
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.playersArr = [null,null] //add new players here ; null value if no players are added
    this.currPlayer = this.playersArr[0]; // default: currPlayer: null; active player: 1 or 2 
    this.board = this.makeBoard() // array of rows, each row is array of cells  (board[y][x])
    this.makeHtmlBoard();
    this.gameOver = false;
    this.element = document.querySelector('table#board')
    // myGameInstances.push(this)
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
  piece.classList.add(`p${this.currPlayer.playerOrder}`); //add name of player who added piece
  piece.style.top = -50 * (y + 2);
  if (this.currPlayer.playerColor !== 'red' || this.currPlayer.playerColor !== 'blue'){
    piece.style.backgroundColor = this.currPlayer.playerColor  
  }
  
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
  arrayToggler(this.playersArr)
  this.currPlayer = this.playersArr[0] 

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }
  
  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer.playerOrder;
  this.gameOver ? alert ('Game is over!'): this.placeInTable(y, x);
  
  // check for win
  if (this.checkForWin()) {
    return this.endGame(`Player ${this.currPlayer.playerName} won!`);
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
      this.board[y][x] === this.currPlayer.playerOrder
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
let myGameInstances = [null]; //manage game instances here, nested array tracks players
let currentGameInstance = myGameInstances[0] //default is null
const startGameButton = document.getElementById('game-start-button')
startGameButton.addEventListener('click', (e) => {
  e.preventDefault();
  isThereAGameChecker() ? resetGame() : startGame();
  getFormValuesAndMakeNewPlayers() /*grab input values and make new player classes*/
})

const startGame = (WIDTH = 7, HEIGHT = 6) =>{
  myGameInstances[0] = new ConnectFourGame(WIDTH,HEIGHT)
  return currentGameInstance = myGameInstances[0];
}

const resetGame = () => {
  const pieceDOMList = document.querySelectorAll('td > div.piece')
  pieceDOMList.forEach(piece => piece.remove())
  currentGameInstance.gameOver = false;
  if (currentGameInstance.currPlayer !== playerOne) currentGameInstance.currPlayer = arrayToggler(currentGameInstance.playersArr);
  currentGameInstance.board = currentGameInstance.makeBoard();
}

const isThereAGameChecker = () => {
  return (myGameInstances[0] !== null) ? true : false; 
}

let currentPlayerInCurrentInstance = isThereAGameChecker() ? currentGameInstance.currPlayer : null;

//Part 3: Player class & color input
class Player {
  constructor (playerName, playerColor){
    this.playerName = playerName;
    this.playerColor = playerColor;
    // currentGameInstance.playersArr.push(this)
  }
  get nameAndColor () {
    return `${this.playerName}: ${this.playerColor}`
  }
}

class PlayerOne extends Player {
  constructor(playerName,playerColor){
    super(playerName,playerColor)
    this.playerOrder = 1;
  }
  set playerOneNameSetter(playerName) {
    if (playerName === '' || typeof playerName !== 'string' || playerName !== 1){
      this.playerName = 1;
    }
    else {
      this.playerName = playerName
      return 
    }
  }
  set playerOneColorSetter(playerColor){
    if (this.playerColor === ''){
      this.playerColor = playerColor;
    }
    else {
      this.playerColor = 'red'
    }
  }
}

class PlayerTwo extends Player {
  constructor(playerName,playerColor){
    super(playerName,playerColor)
    this.playerOrder = 2;
  }
  set playerTwoNameSetter(playerName) {
    if (playerName === ''){
      this.playerName = 2
    }
    else {
      this.playerName = playerName;
      return 
    }
  }
  set playerTwoColorSetter(playerColor){
    if (this.playerColor === ''){
      this.playerColor = 'blue'
    }
    else {
      this.playerColor = playerColor;
    }
  }
}

const arrayToggler = array => {
  [array[0],array[1]] = [array[1], array[0]]
  return array[0]
}


let playerOne = isThereAGameChecker() ? currentGameInstance.playersArr[currentGameInstance.playersArr.indexOf('PlayerOne')] : null; //assign this to instance of player 1 running currently
let playerTwo = isThereAGameChecker() ? currentGameInstance.playersArr[currentGameInstance.playersArr.indexOf('PlayerTwo')] : null; //assign this to instance of player 2 running currently

/*grab input values and make new player classes*/
getFormValuesAndMakeNewPlayers = () => {
  let p1Name = document.querySelector('input#playerOneName').value;
  let p1Color = document.querySelector('input#playerOneColor').value;
  
  let p2Name = document.querySelector('input#playerTwoName').value
  let p2Color = document.querySelector('input#playerTwoColor').value

  const newplayerOne = new PlayerOne(p1Name, p1Color)
  const newPlayerTwo = new PlayerTwo(p2Name, p2Color)
  
  currentGameInstance.playersArr = [newplayerOne, newPlayerTwo]
  currentGameInstance.currPlayer = newplayerOne
  
  return
}
