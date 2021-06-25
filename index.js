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
        posiciones[contador] = {
          row: i,
          column: j,
          value: calcValue({ row: i, column: j }),
        };
        contador++;
      }
    }
  }
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
  valor += calcValue(posicion);
  try {
    if (posicion.direccion == "N") {
      // console.log("Going N");
      // Condicion de salida en busqueda norte
      if (posicion.row == 0) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row - 1,
        column: posicion.column,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }

      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }

    if (posicion.direccion == "NE") {
      // console.log("Going NE");
      // Condicion de salida en busqueda noroeste
      if (posicion.column == 7 || posicion.row == 0) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }

      let nex_position = {
        ...posicion,
        row: posicion.row - 1,
        column: posicion.column + 1,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }
    if (posicion.direccion == "E") {
      // console.log("Going E");
      // Condicion de salida en busqueda este
      if (posicion.column == 7) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row,
        column: posicion.column + 1,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }
    if (posicion.direccion == "SE") {
      // console.log("Going SE");
      // Condicion de salida en busqueda sureste
      if (posicion.column == 7 || posicion.row == 7) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row + 1,
        column: posicion.column + 1,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }
    if (posicion.direccion == "S") {
      // console.log("Going S");
      // Condicion de salida en busqueda sur
      if (posicion.row == 7) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row + 1,
        column: posicion.column,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }
    if (posicion.direccion == "SO") {
      // console.log("Going SO");
      // Condicion de salida en busqueda sur oeste
      if (posicion.column == 0 || posicion.row == 7) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row + 1,
        column: posicion.column - 1,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }
    if (posicion.direccion == "O") {
      // console.log("Going O");
      // Condicion de salida en busqueda oeste
      if (posicion.column == 0) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row,
        column: posicion.column - 1,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
    }
    if (posicion.direccion == "NO") {
      // console.log("Going No");
      // Condicion de salida en busqueda noroeste
      if (posicion.column == 0 || posicion.row == 0) {
        return {
          ...posicion,
          heuristica: valor,
        };
      }
      let nex_position = {
        ...posicion,
        row: posicion.row - 1,
        column: posicion.column - 1,
      };
      if (keeploking(posicion)) {
        return followTrail(nex_position, calcValue(posicion));
      }
      return {
        ...nex_position,
        heuristica: valor + calcValue(nex_position),
      };
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

  // try {
  console.dir(posiciones);
  for (let i = 0; i < posiciones.length; i++) {
    row = posiciones[i].row;
    column = posiciones[i].column;
    value = posiciones[i].value;
    // una casilla tiene 8 vecinos si NO esta en los bordes del tablero.
    if (row > 0 && row < 7 && column > 0 && column < 7) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (row > 0 && row < 7 && column == 0) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
    } else if (row > 0 && row < 7 && column == 7) {
      let N = tablero[row - 1][column];
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (column > 0 && column < 7 && row == 0) {
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
    } else if (column > 0 && column < 7 && row == 7) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (column == 0 && row == 0) {
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
    } else if (column == 7 && row == 0) {
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
    } else if (column == 7 && row == 7) {
      let N = tablero[row - 1][column];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (column == 0 && row == 7) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
    } else {
      console.log("TURNO EN LOS BORDES");
      console.log("ROW=" + row);
      console.log("COLUMN=" + column);
    }
    // Una casilla tiene
    // Aumenta el contador de posisiones validas.
  }
  console.log(valid_moves);
  // } catch (error) {
  //   console.log("Error de no se porque realmente");
  // }
  // console.log("Movimientos validos");
  // console.log(valid_moves);
  return valid_moves;
}

function showtablero(tablero) {
  console.log([0, 1, 2, 3, 4, 5, 6, 7]);
  for (let i = 0; i < 8; i++) {
    console.log(i + "):" + tablero[i]);
  }
}

function moveTo(posibles_movimientos) {
  if (posibles_movimientos.length > 0) {
    let max = -99999;
    let max_index = 0;
    for (let i = 0; i < posibles_movimientos.length; i++) {
      if (posibles_movimientos[i].heuristica > max) {
        max = posibles_movimientos[i].heuristica;
        max_index = i;
      }
    }
    let o = posibles_movimientos[max_index];
    return `${o.row}${o.column}`;
  }
  return "00";
}

app.get("/", (req, res) => {
  let turno = req.query.turno;
  let estado = req.query.estado;
  if (estado) {
    mapToMatrix(estado);
    {
    }
    // Recuperamos las fichas de nuestra posicion.
    let posiciones = getMyposiciones(turno, gametablero);
    let valid_moves = getValidMoves(turno, posiciones, gametablero);
    // Analizando opciones Min Max
    //
    // arbol de un solo nivel

    let arbol = [];
    // console.log(valid_moves);
    showtablero(gametablero);
    for (let i = 0; i < valid_moves.length; i++) {
      let result = followTrail(valid_moves[i], valid_moves[i].value);
      // if (result && result != 0) {
      if (gametablero[result.row][result.column] === "2") {
        arbol.push(result);
      }
      // }
    }
    let move_to = `${moveTo(arbol)}`;
    console.log("IA: MOVED TO " + move_to);
    return res.send(move_to);
  }
  console.log("No hay estado");
  res.send("24");
});

// Place your piece on an empty square so that one (or more) of the opponent's pieces are between yours.

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});
