"use strict";

const levelup = require("levelup");
const leveldown = require("leveldown");
const db = levelup(leveldown("./mydb"));

module.exports = {
  updateLastCommand: (msg, commandName, cb) => {
    db.put(msg.chat.id + "_lastcmd", commandName, cb);
  },

  getLastCommand: (msg, cb) => {
    db.get(msg.chat.id + "_lastcmd", cb);
  },

  addAlarm: (msg, command, value, cb) =>
    db.put(msg.chat.id + "_alarm", command + "|" + value, cb),

  eachAlarm: cb => {
    db.createKeyStream().on("data", data => {
      console.log(data.key, "=", data.value);
    });
  }
};
