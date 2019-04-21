"use strict";

// const binance = require("node-binance-api")().options({
//   APIKEY: '<key>',
//   APISECRET: '<secret>',
//   useServerTime: true // If you get timestamp errors, synchronize to server time at startup
// });

// const GateApi = require("gate-api");
// const client = GateApi.ApiClient.instance;
// client.key = "YOUR API KEY";
// client.secret = "YOUR API SECRET";
// uncomment the next line if you are using the API with other host
// client.basePath = "https://some-other-hosts";

// var api = new GateApi.FuturesApi();
// var orderId = "12345"; // {String} ID returned on order successfully being created

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TG_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const commands = require("./commands/");

let alarms = [];

bot.onText(/\/start|Hi/, msg => commands.sayStart(bot, msg));
bot.onText(/Price/, msg => commands.sayPrice(bot, msg));
bot.onText(/Alarms/, msg => commands.sayAlarms(bot, msg));
bot.onText(/Above/, msg => commands.sayAlarmsAbove(bot, msg));
bot.onText(/Below/, msg => commands.sayAlarmsBelow(bot, msg));

bot.onText(/List/, msg => {
  let chatId = msg.chat.id;
  let lastCommand = "";
  // there is context
  if (
    commandsByChat[chatId] &&
    commandsByChat[chatId][commandsByChat[chatId].length - 1]
  ) {
    lastCommand = commandsByChat[chatId][commandsByChat[chatId].length - 1];
  }
  if (lastCommand === "alarms") {
    let text = "No alarms";
    if (alarms[chatID] && Array.isArray(alarms[chatID])) {
      text = "";
      for (let alarmID in alarms[chatID]) {
        text += alarms[chatID][alarmID] + "\n";
      }
    }
    console.log(alarms, text);
    bot.sendMessage(chatID, text);
  }
});

bot.on("message", msg => commands.handleFollowUp(bot, msg));

bot.on("polling_error", error => {
  console.log(error); // => 'EFATAL'
});

require('./worker/').start()