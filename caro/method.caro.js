const Caro = require("./class.caro");
let Caros = new Map();

module.exports = {
  create(room_id, x, y, turn) {
    let matrixGame = [];
    for (var i = 0; i < x; i++) {
      matrixGame[i] = [];
      for (var j = 0; j < y; j++) {
        matrixGame[i][j] = `${i}-${j}`;
      }
    }
    const caro = new Caro(matrixGame, turn);
    Caros.set(room_id, caro);
    return Caros;
  },

  point(ws, position) {
    let room_id = ws.room_id;
    let winner = Caros.get(room_id).winner;
    if (winner !== null) ws.send("Ván đấu room " + room_id + " đã kết thúc");
    else {
      let x = Number(position.split("-")[0]);
      let y = Number(position.split("-")[1]);
      let boards = Caros.get(room_id).boards;
      let icon = Caros.get(room_id).icon;
      let turn = Caros.get(room_id).turn[`${ws.user_id}`];

      if (icon !== turn) ws.send("Chưa tới lượt");
      else {
        if (boards[x][y] === "X" || boards[x][y] === "O") ws.send("Đã được đi");
        else {
          boards[x][y] = icon;
          let caro = { boards, turn: Caros.get(room_id).turn, icon, winner };
          if (this.check_win(x, y, icon, room_id) === true) {
            caro = {
              boards,
              turn: Caros.get(room_id).turn,
              icon,
              winner: ws.user_id,
            };
            Caros.set(room_id, caro);
            ws.send(icon + " thắng");
          } else {
            caro = {
              boards,
              turn: Caros.get(room_id).turn,
              icon: boards[x][y] === "X" ? "O" : "X",
              winner: null,
            };
            Caros.set(room_id, caro);
            ws.send("Hết lượt");
          }
        }
      }
    }
  },

  check_win(x, y, icon, room_id) {
    return (
      this.check_Horizontal(x, y, icon, room_id) >= 5 ||
      this.check_Vertical(x, y, icon, room_id) >= 5 ||
      this.check_LeftDiagonal(x, y, icon, room_id) >= 5 ||
      this.check_RightDiagonal(x, y, icon, room_id) >= 5 ||
      false
    );
  },

  check_Horizontal(x, y, icon, room_id) {
    const matrixGame = Caros.get(room_id).boards;
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (y + i < matrixGame[0].length && matrixGame[x][y + i] === icon) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (
        y - i >= 0 &&
        y - i < matrixGame[0].length &&
        matrixGame[x][y - i] === icon
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
  },

  check_Vertical(x, y, icon, room_id) {
    const matrixGame = Caros.get(room_id).boards;
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (x + i < matrixGame.length && matrixGame[x + i][y] === icon) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (
        x - i >= 0 &&
        x - i < matrixGame.length &&
        matrixGame[x - i][y] === icon
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
  },
  check_RightDiagonal(x, y, icon, room_id) {
    const matrixGame = Caros.get(room_id).boards;
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (
        x - i >= 0 &&
        x - i < matrixGame.length &&
        y + i < matrixGame[0].length &&
        matrixGame[x - i][y + i] === icon
      ) {
        count++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 5; i++) {
      if (
        x + i < matrixGame.length &&
        y - i >= 0 &&
        y - i < matrixGame[0].length &&
        matrixGame[x + i][y - i] === icon
      ) {
        count++;
      } else {
        break;
      }
    }
    return count;
  },
  check_LeftDiagonal(x, y, icon, room_id) {
    const matrixGame = Caros.get(room_id).boards;
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (
        x - i >= 0 &&
        x - i < matrixGame.length &&
        y - i >= 0 &&
        y - i < matrixGame[0].length &&
        matrixGame[x - i][y - i] === icon
      ) {
        count++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 5; i++) {
      if (
        x + i < matrixGame.length &&
        y + i < matrixGame[0].length &&
        matrixGame[x + i][y + i] === icon
      ) {
        count++;
      } else {
        break;
      }
    }
    return count;
  },
};
