'use strict';

var resource  = require('./resource')
  , _         = require('lodash')
  , ursa      = require('ursa');

function beforeCreate(options, create) {
  options.payment_type = options.payment_type || 'credit_card';
  options.installments = options.installments || 1;
  options.status = options.status || 'local';
  this.pagarme
    .request({ path: '/transactions/card_hash_key' })
    .then(function(data) {
      var key = ursa.createPublicKey(new Buffer(data.public_key));
      var cardJSON = JSON.stringify(cardDataParams(options));
      var cardHash = data.id + '_' + key.encrypt(new Buffer(cardJSON, 'utf8'), 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
      options.card_hash = cardHash;
      clearCardData(options);
      create(options);
    });
}

function cardDataParams(options) {
  return {
    card_number: options.card_number,
    card_holder_name: options.card_holder_name,
    card_expiration_date: options.card_expiration_month + options.card_expiration_year,
    card_cvv: options.card_cvv
  }
}

function clearCardData(options) {
  delete options.card_number;
  delete options.card_holder_name;
  delete options.card_expiration_year;
  delete options.card_expiration_month;
  delete options.card_cvv;
}

var Transaction = resource.create('Transaction', {
  path: '/transactions',

  classMethods: {
    refund: function(id) {
      return this.pagarme.request({
        path: this._options.path + '/' + id + '/refund',
        method: 'POST',
        query: { id: id }
      });
    },

    capture: function(id) {
      return this.pagarme.request({
        path: this._options.path + '/' + id + '/capture',
        method: 'POST',
        query: { id: id }
      });
    }
  }
})
.on('beforeCreate', beforeCreate);

module.exports = Transaction;
