//Set div with correct CSS styling as a tile
function tileCSS(tileElement, row, column, tileCount, color) {
     tileElement.id = `tile${tileCount}`;
     tileElement.style.backgroundColor = color;
     tileElement.style.position = "absolute";
     tileElement.style.height = "10vmin";
     tileElement.style.width = "10vmin";
     tileElement.style.top = `${row*10}vmin`;
     tileElement.style.left = `${column*10}vmin`;
}

//Set div with correct CSS styling as a piece
function pieceCSS(pieceElement, row, column, pieceCount, color, borderColor) {
     pieceElement.id = `piece${pieceCount}`;
     pieceElement.style.backgroundColor = color;
     pieceElement.style.position = "absolute";
     pieceElement.style.height = "6vmin";
     pieceElement.style.width = "6vmin";
     pieceElement.style.top = `${row*10+1}vmin`;
     pieceElement.style.left = `${column*10+1}vmin`;
     pieceElement.style.borderRadius = "50%";
     pieceElement.style.border = `1vmin solid ${borderColor}`;
}

//Return 1 if [row, column] is on the "diagonal" to form the checkerboard
function onDiagonal(row, column) {
     let isOnDiagonal = 0;
     if ((row % 2 == 0) & (column % 2 == 0)) {
          isOnDiagonal = 1;
     } else if ((row % 2 == 1) & (column % 2 == 1)) {
          isOnDiagonal = 1;
     }
     return isOnDiagonal;
}

//Initial piece set-up: 0 for no piece, 1 for player 1, and 2 for player 2
function initialPieceSetUp(row, column) {
     let player = 0;
     if (onDiagonal(row, column) == 1) {
          if (row <= 2) {
               player = 1;
          } else if (row >= 5) {
               player = 2;
          }
     }
     return player;
}

//Create a new tile
function createTile (row, column, tileCount) {
     let newTileElement = document.createElement("div"),
     color = "black";
     if (onDiagonal(row, column) == 1) {
          color = "red";
     }
     tileCSS(newTileElement, row, column, tileCount, color);
     return {element: newTileElement,
          id: newTileElement.id,
          position: [row, column]};
}

//Create a new piece
function createPiece (row, column, pieceCount, player) {
     let newPieceElement = document.createElement("div"),
     color = "red",
     borderColor = "salmon";
     if (player.id == "player2") {
          color = "black",
          borderColor = "gray";
     }
     pieceCSS(newPieceElement, row, column, pieceCount, color, borderColor);
     return {element: newPieceElement, id: newPieceElement.id, position: [row, column], player: player};
}

//Initialize board and pieces
window.onload = function () {
     const board = {
          
          element: document.getElementById("board"),
          tiles: [],
          pieces: [],
          players: [{id: "player1"}, {id: "player2"}],

          initialize: function () {
               this.initializeTiles();
               //this.initializePieces();
          },
          
          initializeTiles: function () {
               let tileCount = 0;
               for (let row = 0; row < 8; row++) {
                    for (let column = 0; column < 8; column++) {
                         let newTile = createTile(row, column, tileCount);
                         this.tiles.push(newTile);
                         this.element.appendChild(newTile.element);
                         tileCount += 1;
                    }
               }
          },

          initializePieces: function () {
               let pieceCount = 0;
               for (let row = 0; row < 8; row++) {
                    for (let column = 0; column < 8; column++) {
                         if (initialPieceSetUp(row, column) != 0) {
                              let player = this.players[0];
                              if (initialPieceSetUp(row, column) == 2) {
                                   player = this.players[1];
                              }
                              let newPiece = createPiece(row, column, pieceCount, player);
                              this.pieces.push(newPiece);
                              this.element.appendChild(newPiece.element);
                              pieceCount += 1;
                         }
                    }
               }
          }

     }
     
     board.initialize();
}