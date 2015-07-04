'use strict';

var async     = require('async')
  , ursa      = require('ursa');

exports.create = function(pagarme, params, cb) {
  async.seq(function(next) {
    pagarme.request({path: '/transactions/card_hash_key'}, function(err, res) {
      if (err) return cb(err);
      next(null, res);
    });
  }, function(res) {
    params.query.card_hash = toHash(res, params.query);
    pagarme.request(params, function(err, res) {
      if (err) return cb(err);
      return cb(null, res);
    });
  })();
};

function toHash(data, options) {
  var key = ursa.createPublicKey(new Buffer(data.public_key))
    , cardJSON = JSON.stringify(cardDataParams(options))
    , cardHash = data.id + '_' + key.encrypt(new Buffer(cardJSON, 'utf8'), 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
  return cardHash;
}

function cardDataParams(options) {
  return {
    card_number: options.card_number,
    card_holder_name: options.card_holder_name,
    card_expiration_date: options.card_expiration_date,
    card_cvv: options.card_cvv
  };
}
