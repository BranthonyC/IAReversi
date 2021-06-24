const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 8080; //Save the port number where your server will be listening

var gameBoard = new Array(8);
for (let i = 0; i < gameBoard.length; i++) {
  gameBoard[i] = new Array(8);
}

function mapToMatrix(estado) {
  let iterador = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      gameBoard[i][j] = estado[iterador];
      iterador++;
    }
  }
}

function getMyPositions(turno, board) {
  let positions = [];
  let contador = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (turno == board[i][j]) {
        positions[contador] = { row: i, column: j };
        contador++;
      }
    }
  }
  console.log("Tenemos fichas de nuestro turno en.");
  console.log(positions);
  return positions;
}

function getValidMoves(turno, positions, board) {
  let row = 0;
  let column = 0;
  let valid_moves = [];
  let contador = 0;
  for (let i = 0; i < positions.length; i++) {
    console.log("Iterando: ");
    console.log(contador);
    console.log("----");
    row = positions[i].row;
    column = positions[i].column;
    let N = board[row - 1][column];
    let NE = board[row - 1][column + 1];
    let E = board[row][column + 1];
    let SE = board[row + 1][column + 1];
    let S = board[row + 1][column];
    let SO = board[row + 1][column - 1];
    let O = board[row][column - 1];
    let NO = board[row - 1][column - 1];
    // una casilla tiene 8 vecinos si NO esta en los bordes del tablero.
    if (row != 0 && row != 7 && column != 0 && column != 7) {
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direction: "N",
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direction: "NE",
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direction: "E",
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direction: "SE",
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direction: "S",
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direction: "SO",
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direction: "O",
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direction: "No",
        });
      }
    }
    // Una casilla tiene
    // Aumenta el contador de posisiones validas.
    contador++;
  }
  console.log("Movimientos validos");
  console.log(valid_moves);
  return valid_moves;
}

function showBoard(board) {
  for (let i = 0; i < 8; i++) {
    console.log(board[i]);
  }
}

app.get("/", (req, res) => {
  let turno = req.query.turno;
  let estado = req.query.estado;
  if (estado) {
    console.log(turno);
    mapToMatrix(estado);
    // Recuperamos las fichas de nuestra posicion.
    let positions = getMyPositions(turno, gameBoard);
    let valid_moves = getValidMoves(turno, positions, gameBoard);
    showBoard(gameBoard);
    return res.send("24");
  }
  console.log("No hay estado");
  res.send("24");
});

// Place your piece on an empty square so that one (or more) of the opponent's pieces are between yours.

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});
