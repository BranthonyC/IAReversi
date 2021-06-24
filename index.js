const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 8080; //Save the port number where your server will be listening

var gametablero = new Array(8);
for (let i = 0; i < gametablero.length; i++) {
  gametablero[i] = new Array(8);
}

const heuristica = new Array(8);
heuristica[0] = [120, -20, 20, 5, 5, 20, -20, 120];
heuristica[1] = [-20, -40, -5, -5, -5, -5, -40, -20];
heuristica[2] = [20, -5, 15, 3, 3, 15, -5, -20];
heuristica[3] = [5, -5, 3, 3, 3, 3, -5, 5];
heuristica[4] = [5, -5, 3, 3, 3, 3, -5, 5];
heuristica[5] = [20, -5, 15, 3, 3, 15, -5, -20];
heuristica[6] = [-20, -40, -5, -5, -5, -5, -40, -20];
heuristica[7] = [120, -20, 20, 5, 5, 20, -20, 120];

function mapToMatrix(estado) {
  let iterador = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      gametablero[i][j] = estado[iterador];
      iterador++;
    }
  }
}

function getMyposiciones(turno, tablero) {
  let posiciones = [];
  let contador = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (turno == tablero[i][j]) {
        posiciones[contador] = { row: i, column: j };
        contador++;
      }
    }
  }
  console.log("Tenemos fichas de nuestro turno en.");
  console.log(posiciones);
  return posiciones;
}

/**
 * Dada una posicion retorna un valor acorde a la matriz
 * de euristicas.
 */
function calcValue(posicion) {
  return heuristica[posicion.row][posicion.column];
}

/**
 * Verifica si en la posicion que recibe como parametro existe una ficha
 * que me permita continuar buscando.
 */
function keeploking(posicion, turno) {
  // Solamente busco posiciones validas, es decir posiciones en blanco, si de repente
  // tengo todas las fichas en esa direccion de mi color las ignoro.
  if (gametablero[posicion.row][posicion.column] === 2) {
    return true; // Ya no necesito buscar
  }
  return false;
}
/**
 * Dada una posicion y una direccion, seguira en busca de una
 * posicion vacia en la direccion dada, si no esta vacia y no es
 * del mismo turno entonces retorna la misma funcion en busca de
 * la siguiente tabla.
 *
 * Funcion recursiva, devolvera 0 para indicar que no se pudo colocar
 * la ficha en caso llegue a los bordes del tablero sin encontrar un espacio
 * libre.
 *
 * Al ser recursiva devolvera un valor que sera la sumatoria de todas
 * las casillas visitadas, el valor de las casillas se tomara de la euristica.
 */
function followTrail(posicion, valor) {
  console.log("Visitando la posicion ");
  console.dir(posicion);
  console.log("-----------------");
  valor += valor;
  try {
    if (posicion.direccion == "N") {
      console.log("Going N");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row - 1, column: posicion.column },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "NE") {
      console.log("Going NE");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row - 1, column: posicion.column + 1 },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "E") {
      console.log("Going E");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row, column: posicion.column + 1 },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "SE") {
      console.log("Going SE");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row + 1, column: posicion.column + 1 },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "S") {
      console.log("Going S");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row + 1, column: posicion.column },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "SO") {
      console.log("Going SO");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row + 1, column: posicion.column - 1 },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "O") {
      console.log("Going O");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row, column: posicion.column - 1 },
          calcValue(posicion)
        );
      }
      return valor;
    } else if (posicion.direccion == "NO") {
      console.log("Going No");
      if (keeploking(posicion)) {
        return followTrail(
          { ...posicion, row: posicion.row - 1, column: posicion.column - 1 },
          calcValue(posicion)
        );
      }
      return valor;
    }
  } catch (TypeError) {
    console.log("No se pudo encontrar una posicion valida para la ficha.");
    return 0; // No se pudo encontrar una posicion a la ficha
  }

  // Condiciones de salida
  // if (posicion.row - 1 <= 0 || posicion.column - 1 <= 0) {
  //   return 0; // No se pudo colocar una ficha
  // }
}

function getValidMoves(turno, posiciones, tablero) {
  let row = 0;
  let column = 0;
  let valid_moves = [];
  let contador = 0;
  for (let i = 0; i < posiciones.length; i++) {
    console.log("Iterando: ");
    console.log(contador);
    console.log("----");
    row = posiciones[i].row;
    column = posiciones[i].column;
    let N = tablero[row - 1][column];
    let NE = tablero[row - 1][column + 1];
    let E = tablero[row][column + 1];
    let SE = tablero[row + 1][column + 1];
    let S = tablero[row + 1][column];
    let SO = tablero[row + 1][column - 1];
    let O = tablero[row][column - 1];
    let NO = tablero[row - 1][column - 1];
    // una casilla tiene 8 vecinos si NO esta en los bordes del tablero.
    if (row != 0 && row != 7 && column != 0 && column != 7) {
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
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

function showtablero(tablero) {
  for (let i = 0; i < 8; i++) {
    console.log(tablero[i]);
  }
}

app.get("/", (req, res) => {
  let turno = req.query.turno;
  let estado = req.query.estado;
  if (estado) {
    console.log(turno);
    mapToMatrix(estado);
    {
    }
    // Recuperamos las fichas de nuestra posicion.
    let posiciones = getMyposiciones(turno, gametablero);
    let valid_moves = getValidMoves(turno, posiciones, gametablero);
    // Analizando opciones Min Max
    console.log("Min max values");
    for (let i = 0; i < valid_moves.length; i++) {
      console.log(followTrail(valid_moves[i], calcValue(valid_moves[i]))); // El valor se suma al inicio de followTrail
    }
    showtablero(gametablero);
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
