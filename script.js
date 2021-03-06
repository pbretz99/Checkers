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
     if (onDiagonal(row, column) == 1) {color = "red", altColor = "darkred";}
     tileCSS(newTileElement, row, column, tileCount, color);
     return {element: newTileElement,
          id: `tile${tileCount}`,
          row: row, column: column,
          pieces: [],
          shade: function () {this.element.style.backgroundColor = altColor;},
          unshade: function () {this.element.style.backgroundColor = color;}
     };
}

//Create a new piece
function createPiece (tile, pieceCount, player) {
     let newPieceElement = document.createElement("div"),
     color = "red", altColor = "darkred", borderColor = "salmon";
     if (player.id == "player2") {color = "black", altColor = "darkslategray", borderColor = "gray";}
     pieceCSS(newPieceElement, tile.row, tile.column, pieceCount, color, borderColor);
     return {element: newPieceElement,
          tile: tile,
          id: newPieceElement.id,
          player: player,
          selected: false,
          shade: function () {this.element.style.backgroundColor = altColor;},
          unshade: function () {this.element.style.backgroundColor = color;}
     };
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
     for (otherPiece of allPieces) {otherPiece.selected = false; otherPiece.unshade();}
     //document.getElementById("testing").innerHTML += `selected ${piece.id}<br>`;
     for (tile of moveTiles) {tile.shade();}
     piece.selected = true;
     piece.shade();
}

//Piece de-selecting
function deselectPiece(moveTiles, piece) {
     //document.getElementById("testing").innerHTML += `de-selected ${piece.id}<br>`;
     for (tile of moveTiles) {tile.unshade();}
     piece.selected = false;
     piece.unshade();
}


//Move piece event wrapper
function movePieceWrapper(piece, newTile, moveTiles, allTiles, allPieces, boardElement, maxRow, maxCol, players) {
     if (piece.selected) {
          movePiece(piece, newTile, moveTiles);
          clearAllListeners(boardElement, allTiles, allPieces);
          setPlayer(otherPlayer(piece.player, players), maxRow, maxCol, allTiles, allPieces, boardElement, players);
          //document.getElementById("testing").innerHTML += `Move ${piece.id} to ${newTile.id}<br>`;
     }
}

//Move piece to new tile
function movePiece(piece, newTile, moveTiles) {
     piece.tile.pieces = [];
     newTile.pieces = [piece];
     piece.tile = newTile;
     piece.element.style.top = `${newTile.row*10+1}vmin`;
     piece.element.style.left = `${newTile.column*10+1}vmin`;
     piece.selected = false;
     piece.unshade();
     for (tile of moveTiles) {tile.unshade();}
}

//Remove all the listeners
function clearAllListeners(boardElement, tiles, pieces) {
     for (tile of tiles) {
          clearTileListeners(tile, boardElement);
     }
     for (piece of pieces) {
          clearPieceListeners(piece, boardElement);
     }
}

//Clear listeners from a tile
function clearTileListeners(tile, boardElement) {
     let newElement = tile.element.cloneNode(true);
     boardElement.replaceChild(newElement, tile.element);
     tile.element = newElement;
}

//Clear listeners from a piece
function clearPieceListeners(piece, boardElement) {
     let newElement = piece.element.cloneNode(true);
     boardElement.replaceChild(newElement, piece.element);
     piece.element = newElement;
}

//Set player
function setPlayer(player, maxRow, maxCol, tiles, pieces, boardElement, players) {
     for (let piece of pieces) {
          if (piece.player == player) {
               let moves = availableMoves(piece, maxRow, maxCol, tiles);
               if (moves.length > 0) {
                    piece.element.addEventListener("click", function(){selectPieceWrapper(moves, piece, tiles, pieces)});
                    for (let tile of moves) {
                         tile.element.addEventListener("click", function(){movePieceWrapper(piece, tile, moves, tiles, pieces, boardElement, maxRow, maxCol, players)})
                    }
               }
          }
     }
}

//Simple function to get opposite player
function otherPlayer(player, players) {
     for (potentialPlayer of players) {
          if (potentialPlayer != player) {
               return potentialPlayer;
          }
     }
}

//Available moves to a piece
function availableMoves(piece, maxRow, maxCol, tiles) {
     let moves = [], potentialPos=diagonalPositions(piece.tile.row, piece.tile.column);
     for (pos of potentialPos) {
          let validMove = true;
          if (!onBoard(pos[0], pos[1], maxRow, maxCol)) {validMove = false;}
          else if (occupied(pos[0], pos[1], maxRow, maxCol, tiles)) {validMove = false;}
          else if ((piece.player.id == "player1") & (pos[0] < piece.tile.row)) {validMove = false;}
          else if ((piece.player.id == "player2") & (pos[0] > piece.tile.row)) {validMove = false;}
          if (validMove) {moves.push(accessTile(pos[0], pos[1], maxRow, maxCol, tiles));}
     }
     return moves;
}

//Is (row, column) on the board
function onBoard(row, column, maxRow, maxCol) {
     let isOnBoard = true;
     if (row < 0) {isOnBoard = false;}
     else if (column < 0) {isOnBoard = false;}
     else if (row >= maxRow) {isOnBoard = false;}
     else if (column >= maxCol) {isOnBoard = false;}
     return isOnBoard;
}

//Is tile occupied
function occupied(row, column, maxRow, maxCol, tiles) {
     let isOccupied = false, tile = accessTile(row, column, maxRow, maxCol, tiles);
     if (tile.pieces.length > 0) {isOccupied = true;}
     return isOccupied;
}

//Get tile from list
function accessTile(row, column, maxRow, maxCol, tiles) {
     if (onBoard(row, column, maxRow, maxCol)) {
          let index = row * maxCol + column;
          return tiles[index];
     } else {
          return 0;
     }
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
               this.initializePlayer(this.players[0]);
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

          initializePlayer: function (player) {
               let maxRow = this.dimensions[0], maxCol = this.dimensions[1], allTiles = this.tiles, allPieces = this.pieces, boardElement = this.element, players=this.players;
               setPlayer(player, maxRow, maxCol, allTiles, allPieces, boardElement, players);
          }
     }
     
     board.initialize();
     //board.playerMovesShow(board.players[0]);
     
}