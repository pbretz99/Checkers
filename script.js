//Function for setting a new div with correct CSS styling
function tileCSS(tileElement, row, column, tileCount, color) {
     tileElement.id = `tile${tileCount}`;
     tileElement.style.backgroundColor = color;
     tileElement.style.position = "absolute";
     tileElement.style.height = "10vmin";
     tileElement.style.width = "10vmin";
     tileElement.style.top = `${row*10}vmin`;
     tileElement.style.left = `${column*10}vmin`;
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

//Create a new tile object
function createTile (row, column, tileCount) {
     let newTileElement = document.createElement("div");
     let color = "black";
     if (onDiagonal(row, column) == 1) {
          color = "red";
     }
     tileCSS(newTileElement, row, column, tileCount, color);
     const newTile = {element: newTileElement, position: [row, column]}
     return newTile;
}

window.onload = function () {
     let boardElement = document.getElementById("board");
     let tileCount = 0;
     for (let row = 0; row < 8; row++) {
          for (let column = 0; column < 8; column++) {
               let newTile = createTile(row, column, tileCount);
               boardElement.appendChild(newTile.element);
               tileCount += 1;
          }
     }
}