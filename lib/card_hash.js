'use strict';

var _       = require('lodash')
  , ursa    = require('ursa')
  , Promise = require('bluebird');

function CardHash() { }

function cardDataParams(options) {
  return {
    card_number: options.card_number,
    card_holder_name: options.card_holder_name,
    card_expiration_date: options.card_expiration_month + options.card_expiration_year,
    card_cvv: options.card_cvv
  }
}

CardHash.generate = Promise.method(function(pagarme, options) {
  return pagarme.request({
    path: '/transactions/card_hash_key'
  })
  .then(function(data) {
    var key = ursa.createPublicKey(new Buffer(data.public_key));
    var cardJSON = JSON.stringify(cardDataParams(options));
    return data.id + '_' + key.encrypt(new Buffer(cardJSON, 'utf8'), 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
  });
});

module.exports = CardHash;
