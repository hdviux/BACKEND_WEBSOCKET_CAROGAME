module.exports = class Room {
  constructor(ws) {
    this.players = new Map([[ws, ws.user_id]]);
  }
};
