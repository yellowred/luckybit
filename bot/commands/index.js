"use strict";
const state = require("../state/");
const sourceDeribit = require("../sources/deribit");
const sourceGateio = require("../sources/gateio");

const alarmAdd = msg => {
  if (!Array.isArray(alarms[msg.chat.id])) {
    alarms[msg.chat.id] = [];
  }
  let value = parseInt(msg.text);
  let command = "deribit_price_above";
  let alarmID = command + "_" + value;
  alarms[msg.chat.id][alarmID] = {
    chatID: msg.chat.id,
    command: command,
    value: value
  };
};

const updateLastCommandAndSay = (bot, msg, commandName, commandHandler) => {
  console.log(msg.chat.id + "_lastcmd", commandName);
  state.updateLastCommand(msg, commandName, err => {
    return handleError(err, bot, msg, commandHandler);
  });
};

const handleError = (err, bot, msg, cb) => {
  if (err) {
    console.log(err);
    bot.sendMessage(msg.chat.id, "Error");
  } else {
    cb(bot, msg);
  }
};

module.exports = {
  sayStart: (bot, msg) => {
    updateLastCommandAndSay(bot, msg, "", (bot, msg) => {
      bot.sendMessage(msg.chat.id, "Welcome", {
        reply_markup: {
          keyboard: [["Price"], ["Alarms"]],
          one_time_keyboard: true
        }
      });
    });
  },

  sayPrice: (bot, msg) => {
    updateLastCommandAndSay(bot, msg, "price", (bot, msg) => {
      bot.sendMessage(msg.chat.id, "Choose Coin", {
        reply_markup: {
          keyboard: [["BTC", "XTZ"], ["EOS", "ETH"]]
        }
      });
    });
  },

  sayAlarms: (bot, msg) => {
    updateLastCommandAndSay(bot, msg, "alarms", (bot, msg) => {
      bot.sendMessage(msg.chat.id, "Create Alarm", {
        reply_markup: {
          keyboard: [["Above"], ["Below"], ["List"]]
        }
      });
    });
  },

  sayAlarmsAbove: (bot, msg) => {
    updateLastCommandAndSay(bot, msg, "alarms/above", (bot, msg) => {
      bot.sendMessage(msg.chat.id, "Level?", {
        reply_markup: { remove_keyboard: true }
      });
    });
  },

  sayAlarmsBelow: (bot, msg) => {
    updateLastCommandAndSay(bot, msg, "alarms/below", (bot, msg) => {
      bot.sendMessage(msg.chat.id, "Level?", {
        reply_markup: { remove_keyboard: true }
      });
    });
  },

  handleFollowUp: (bot, msg) => {
    console.log("handleFollowUp", msg);
    state.getLastCommand(msg, (err, lastCommand) => {
      lastCommand = lastCommand + ""; // convert from buffer to string
      if (err) {
        console.log(err);
      } else {
        if (lastCommand === "alarms/above" && msg.text > 0) {
          let commandName = "deribit_price_above";
          let value = parseInt(msg.text);
          state.addAlarm(msg, commandName, value, err => {
            bot.sendMessage(
              msg.chat.id,
              "Will notify if BTC price on Deribit go above " + value
            );
          });
        } else if (lastCommand === "alarms/below" && msg.text > 0) {
          let commandName = "deribit_price_below";
          let value = parseInt(msg.text);
          state.addAlarm(msg, commandName, value, err => {
            bot.sendMessage(
              msg.chat.id,
              "Will notify if BTC price on Deribit go below " + value
            );
          });
        } else if (lastCommand === "price") {
          if (msg.text === "BTC") {
            bot.sendMessage(msg.chat.id, "Getting price for BTC...");
            sourceDeribit.price().then(result => {
              bot.sendMessage(msg.chat.id, "BTC Deribit: " + result.result.btc);
            });
          } else {
            if (msg.text.length === 3) {
              let coinTicker = msg.text + "_btc";
              sourceGateio.price(coinTicker).then(tickerData => {
                console.log(tickerData);
                bot.sendMessage(
                  msg.chat.id,
                  coinTicker +
                    "@Gate.io:\nLast: " +
                    tickerData.last +
                    "\n24h low: " +
                    tickerData.low24hr +
                    "\n24h high: " +
                    tickerData.high24hr
                );
                return tickerData;
              });
            } else {
              bot.sendMessage(msg.chat.id, "Not supported.");
            }
          }
        }
      }
    });
  }
};
