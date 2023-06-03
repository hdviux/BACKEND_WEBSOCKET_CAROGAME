module.exports = class Caro {
  constructor(boards, turn) {
    this.boards = boards;
    this.turn = turn;
    this.icon = "X";
    this.winner = null;
  }
};
