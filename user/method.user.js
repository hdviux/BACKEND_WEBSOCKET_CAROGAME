const crypto = require("crypto");
const User = require("./class.user");
const Users = require("./list.user");

module.exports = {
  create(ws, user_id) {
    ws.user_id = user_id;
    ws.room_id = null;
    const user_userName = crypto.randomBytes(20).toString("hex");
    const new_User = new User(user_id, user_userName, "123456");
    Users.set(ws, null);
    return ws.send(JSON.stringify(new_User));
  },

  get(ws) {
    return ws.room_id;
  },

  delete(ws) {
    return Users.delete(ws);
  },
};
