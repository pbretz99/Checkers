
function onDiagonal(row, column) {
     var isOnDiagonal = false;
     if (row % 2 == 0) {
          if (column % 2 == 0) {
               isOnDiagonal = true;
          }
     } else {
          if (column % 2 == 1) {
               isOnDiagonal = true;
          }
     }
     return isOnDiagonal;
};

window.onload = function () {
     
     var gameBoard = [
          [0, 0],
          [0, 0]
     ];

     var Board = {
          board: gameBoard,
          tilesElement: document.getElementById("tiles"),
          initialize: function () {
               var countTiles = 0;
               for (let row in this.board) {
                    for (let column in this.board[row]) {
                         countTiles = this.tileRender(row, column, countTiles)
                    }
               }
          },
          tileRender: function (row, column, countTiles) {
               /*if (onDiagonal(row, column)) {
                    let tileColor = "black";
               } else {
                    let tileColor = "red";
               }
               this.tilesElement.append(`<div class="tile ${tileColor}" id="tile${countTiles}" style="top:${row*10}vm;left:${column*10}vm;"</div>`);*/
               this.tilesElement.append(`<div class="tile red" id="tile${countTiles}" style="top:${row*10}vm;left:${column*10}vm;"></div>`);
               return countTiles + 1;
          }
     }

     Board.initialize();
}

