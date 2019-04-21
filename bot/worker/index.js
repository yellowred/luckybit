"use strict";
const state = require("../state/");

module.exports = {
  start: () => {
    setInterval(() => {

      state.eachAlarm()


      // for (let chatID in alarms) {
      //   for (let alarmID in alarms[chatID]) {
      //     let alarm = alarms[chatID][alarmID];
          
      //     if (alarm.command === "deribit_price_above") {
      //       deribit.index(result => {
      //         if (result && result.result.btc > alarm.value) {
      //           bot.sendMessage(
      //             alarm.chatID,
      //             "BTC (deribit) price: " +
      //               result.result.btc +
      //               ". Above " +
      //               alarm.value +
      //               "."
      //           );
      //           delete alarms[chatID][alarmID];
      //         }
      //       });
      //     } else if (alarm.command === "deribit_price_below") {
      //       deribit.index(result => {
      //         if (result && result.result.btc < alarm.value) {
      //           bot.sendMessage(
      //             alarm.chatID,
      //             "BTC (deribit) price: " +
      //               result.result.btc +
      //               ". Below " +
      //               alarm.value +
      //               "."
      //           );
      //           delete alarms[chatID][alarmID];
      //         }
      //       });
      //     }
        
    }, 10000);     
  }
};
