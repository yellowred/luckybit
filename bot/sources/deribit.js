"use strict";
const Bluebird = require("bluebird");
let DeribitRestClient = require("deribit-api").RestClient;
let deribit = new DeribitRestClient();

module.exports = {
  price: label => deribit.index()
};
