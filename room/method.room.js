const crypto = require("crypto");
const Room = require("./class.room");
const Users = require("../user/list.user");
const Caro_Method = require("../caro/method.caro");
let Rooms = new Map();

module.exports = {
  create(ws) {
    if (ws.room_id !== null) return ws.send("Đã tạo có room");
    else {
      const room_id = crypto.randomBytes(20).toString("hex");
      const new_room = new Room(ws);
      Rooms.set(room_id, new_room);
      ws.room_id = room_id;
      Users.set(ws, room_id);
      return ws.send(room_id);
    }
  },

  join(ws, room_id) {
    if (ws.room_id !== null) return ws.send("Đang ở room khác");
    else {
      const new_player = new Map(Rooms.get(room_id).players);
      if (Rooms.get(room_id).players.size === 2) ws.send("Méo thêm đc");
      else {
        new_player.set(ws, ws.user_id);
        Rooms.set(room_id, { players: new_player });
        ws.room_id = room_id;
        Users.set(ws, room_id);
        let list_players_room = [];
        new_player.forEach((value, key, map) => {
          list_players_room.push(value);
        });
        const random = Math.floor(Math.random() * list_players_room.length);
        const get_random = list_players_room[random];
        const field_O = list_players_room.filter(
          (data) => data != get_random
        )[0];
        const turn = {};
        turn[get_random] = "X";
        turn[`${field_O}`] = "O";
        Caro_Method.create(room_id, 5, 5, turn);
        return ws.send(JSON.stringify({ room_id, size: new_player.size }));
      }
    }
  },

  remove(ws) {
    const room_id = ws.room_id;
    if (room_id !== null) {
      ws.room_id = null;
      Users.set(ws, null);
      const get_player = new Map(Rooms.get(room_id).players);
      if (Rooms.get(room_id).players.size === 2) {
        get_player.delete(ws);
        Rooms.set(room_id, { players: get_player });
        return ws.send(JSON.stringify({ room_id, size: get_player.size }));
      } else {
        Rooms.delete(room_id);
        return ws.send(JSON.stringify({ room_id, size: 0 }));
      }
    }
  },

  get(ws) {
    let room_id = ws.room_id;
    let list_players_room = [];
    new Map(Rooms.get(room_id).players).forEach((value, key, map) => {
      list_players_room.push(value);
    });
    return ws.send(
      JSON.stringify({
        room_id,
        size: 0,
        size: list_players_room.length,
        players: list_players_room,
      })
    );
  },

  send(ws, message) {
    let room_id = ws.room_id;
    new Map(Rooms.get(room_id).players).forEach((value, key, map) => {
      key.send(message);
    });
  },
};
