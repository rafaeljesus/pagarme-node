'use strict';

var Pagarme = require('./pagarme');

module.exports = function(key) {
  return new Pagarme({
    key: key
  });
};

module.exports.Pagarme = Pagarme;
