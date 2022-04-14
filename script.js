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
     let isOnDiagonal = false;
     if ((row % 2 == 0) & (column % 2 == 0)) {
          isOnDiagonal = true;
     } else if ((row % 2 == 1) & (column % 2 == 1)) {
          isOnDiagonal = true;
     }
     return isOnDiagonal;
}


//Initial piece set-up: 0 for no piece, 1 for player 1, and 2 for player 2
function initialPieceSetUp(row, column) {
     let player = 0;
     if (onDiagonal(row, column)) {
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
     color = "black", altColor = "black";
     if (onDiagonal(row, column) == 1) {
          color = "red", altColor = "darkred";
     }
     tileCSS(newTileElement, row, column, tileCount, color);
     return {element: newTileElement,
          id: `tile${tileCount}`,
          row: row, column: column,
          pieces: [],
          shade: function () {
               this.element.style.backgroundColor = altColor;
          },
          unshade: function () {
               this.element.style.backgroundColor = color;
          }};
}

//Switch background color of element between color and altColor
function colorSwitch(element, color, altColor) {
     let bgdColor = element.style.backgroundColor;
     if (bgdColor != altColor) {
          element.style.backgroundColor = altColor;
     } else {
          element.style.backgroundColor = color;
     }
}

//Create a new piece
function createPiece (tile, pieceCount, player) {
     let newPieceElement = document.createElement("div"),
     color = "red",
     borderColor = "salmon";
     if (player.id == "player2") {
          color = "black",
          borderColor = "gray";
     }
     pieceCSS(newPieceElement, tile.row, tile.column, pieceCount, color, borderColor);
     return {element: newPieceElement, tile: tile, id: newPieceElement.id, player: player, selected: false};
}

//Get positions diagonally adjacent to [row, column]
function diagonalPositions(row, column) {
     let positions = [];
     for (let i = -1; i < 2; i+=2) {
          for (let j = -1; j < 2; j+=2) {
               positions.push([row+i, column+j]);
          }
     }
     return positions;
}

//Piece selection/de-selection event wrapper
function selectPieceWrapper(moveTiles, piece, allTiles, allPieces) {
     if (!piece.selected) {selectPiece(moveTiles, piece, allTiles, allPieces);}
     else {deselectPiece(moveTiles, piece);}
}

//Piece selecting
function selectPiece(moveTiles, piece, allTiles, allPieces) {
     for (tile of allTiles) {tile.unshade();}
     for (otherPiece of allPieces) {otherPiece.selected = false;}
     //document.getElementById("testing").innerHTML += `selected ${piece.id}<br>`;
     for (tile of moveTiles) {tile.shade();}
     piece.selected = true; 
}

//Piece de-selecting
function deselectPiece(moveTiles, piece) {
     //document.getElementById("testing").innerHTML += `de-selected ${piece.id}<br>`;
     for (tile of moveTiles) {tile.unshade();}
     piece.selected = false;
}

//Initialize board and pieces
window.onload = function () {
     
     const board = {
          
          element: document.getElementById("board"),
          dimensions: [8, 8],
          tiles: [],
          pieces: [],
          players: [{id: "player1"}, {id: "player2"}],

          initialize: function () {
               this.initializeTiles();
               this.initializePieces();
          },
          
          initializeTiles: function () {
               let tileCount = 0;
               for (let row = 0; row < this.dimensions[0]; row++) {
                    for (let column = 0; column < this.dimensions[1]; column++) {
                         this.tiles[tileCount] = new createTile(row, column, tileCount);
                         this.element.appendChild(this.tiles[tileCount].element);
                         tileCount += 1;
                    }
               }
          },

          initializePieces: function () {
               let pieceCount = 0;
               for (tile of this.tiles) {
                    if (initialPieceSetUp(tile.row, tile.column) != 0) {
                         let player = this.players[0];
                         if (initialPieceSetUp(tile.row, tile.column) == 2) {
                              player = this.players[1];
                         }
                         this.pieces[pieceCount] = new createPiece(tile, pieceCount, player);
                         this.element.appendChild(this.pieces[pieceCount].element);
                         tile.pieces.push(this.pieces[pieceCount]);
                         pieceCount += 1;
                    }
               }
          },

          availableMoves: function (piece) {
               let moves = [], potentialPos=diagonalPositions(piece.tile.row, piece.tile.column);
               for (pos of potentialPos) {
                    let validMove = true;
                    if (!this.onBoard(pos[0], pos[1])) {validMove = false;}
                    else if (this.occupied(pos[0], pos[1])) {validMove = false;}
                    else if ((piece.player.id == "player1") & (pos[0] < piece.tile.row)) {validMove = false;}
                    else if ((piece.player.id == "player2") & (pos[0] > piece.tile.row)) {validMove = false;}
                    if (validMove) {moves.push(this.accessTile(pos[0], pos[1]));}
               }
               return moves;
          },

          playerMovesShow: function (player) {
               let allTiles = this.tiles, allPieces = this.pieces;
               for (let piece of this.pieces) {
                    if (piece.player == player) {
                         let moves = this.availableMoves(piece);
                         if (moves.length > 0) {
                              piece.element.addEventListener("click", function(){selectPieceWrapper(moves, piece, allTiles, allPieces)});
                         }
                    }
               }
          },

          onBoard: function (row, column) {
               let isOnBoard = true;
               if (row < 0) {isOnBoard = false;}
               else if (column < 0) {isOnBoard = false;}
               else if (row >= this.dimensions[0]) {isOnBoard = false;}
               else if (column >= this.dimensions[1]) {isOnBoard = false;}
               return isOnBoard;
          },

          occupied: function (row, column) {
               let isOccupied = false, tile = this.accessTile(row, column);
               if (tile.pieces.length > 0) {isOccupied = true;}
               return isOccupied;
          },

          accessTile: function(row, column) {
               if (this.onBoard(row, column)) {
                    let index = row * this.dimensions[1] + column;
                    return this.tiles[index];
               } else {
                    return 0;
               }
          },

     }
     
     board.initialize();
     board.playerMovesShow(board.players[0]);
     
}