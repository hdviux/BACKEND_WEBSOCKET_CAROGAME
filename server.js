const WebSocketServer = require("ws");
const crypto = require("crypto");
const User_Method = require("./user/method.user");
const Room_Method = require("./room/method.room");
const Caro_Method = require("./caro/method.caro");
const Users = require("./user/list.user");

const wss = new WebSocketServer.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ///client connect server  ///server send to client after client connect
  ws.room_id = null;
  const user_id = crypto.randomBytes(20).toString("hex");
  User_Method.create(ws, user_id);

  console.log("\n-----User " + user_id + " connected-----\n");

  ///server receive from client
  ws.on("message", (data) => {
    const json_data = JSON.parse(data);
    switch (json_data.request) {
      case "CREATE_ROOM":
        Room_Method.create(ws);
        break;
      case "JOIN_ROOM":
        Room_Method.join(ws, json_data.room_id);
        break;
      case "REMOVE_ROOM":
        Room_Method.remove(ws);
        break;
      case "SEND_MESS_ROOM":
        Room_Method.send(ws, json_data.message);
        break;
      case "SEND_POINT_BOARD_ROOM":
        Caro_Method.point(ws, json_data.position);
        break;
      default:
        break;
    }
  });

  ///client disconnect server
  ws.on("close", () => {
    console.log("\n-----User " + ws.user_id + " disconnected-----\n");
    Room_Method.remove(ws);
    User_Method.delete(ws);
  });

  ///error
  ws.onerror = function () {
    console.log("Some Error occurred");
  };
});
console.log("The WebSocket server is running on port 8080");
