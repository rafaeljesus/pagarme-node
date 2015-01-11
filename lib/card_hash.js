'use strict';

var resource  = require('./resource')
  , _         = require('lodash')
  , ursa      = require('ursa');

exports.create = function(pagarme, options, create) {
  return pagarme
    .request({ path: '/transactions/card_hash_key' })
    .bind(this)
    .then(function(data) {
      options.card_hash = toHash(data, options);
      create(options);
    });
};

function toHash(data, options) {
  var key = ursa.createPublicKey(new Buffer(data.public_key));
  var cardJSON = JSON.stringify(cardDataParams(options));
  var cardHash = data.id + '_' + key.encrypt(new Buffer(cardJSON, 'utf8'), 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
  return cardHash;
};

function cardDataParams(options) {
  return {
    card_number: options.card_number,
    card_holder_name: options.card_holder_name,
    card_expiration_date: options.card_expiration_date,
    card_cvv: options.card_cvv
  }
}
