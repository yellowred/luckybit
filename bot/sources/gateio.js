"use strict";
const fetch = require("node-fetch");
const Bluebird = require("bluebird");
fetch.Promise = Bluebird;

module.exports = {
  price: coinTicker =>
    fetch("https://data.gateio.co/api2/1/ticker/" + coinTicker)
      .then(res => res.json())
      .catch(err => console.error(err))
};
