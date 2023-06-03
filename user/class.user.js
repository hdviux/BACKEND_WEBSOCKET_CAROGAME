const crypto = require("crypto");

module.exports = class User {
  constructor(id, userName, password) {
    this.id = id;
    this.userName = userName;
    this.password = crypto.createHash("sha256").update(password).digest("hex");
  }
};
