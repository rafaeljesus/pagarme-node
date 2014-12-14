'use strict';

var resource  = require('./resource')
  , _         = require('lodash')
  , Promise   = require('bluebird')
  , ursa      = require('ursa');

function beforeCreate(options, callback) {
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
      callback(options);
    });
}

function cardDataParams(options) {
  return {
    card_number: options.card_number,
    card_holder_name: options.card_holder_name,
    card_expiration_date: options.card_expiration_date,
    card_cvv: options.card_cvv
  }
}

var Transaction = resource.create('Transaction', {
  path: '/transactions',

  classMethods: {
    refund: Promise.method(function(id) {
      return this.pagarme.request({
        path: this._options.path + '/' + id + '/refund',
        method: 'POST',
        query: { id: id }
      })
      .bind(this)
      .then(function(data) {
        return new this(data);
      });
    }),

    capture: Promise.method(function(id, options) {
      return this.pagarme.request(_.extend({
        path: this._options.path + '/' + id + '/capture',
        method: 'POST',
        query: { id: id }
      }), options)
      .bind(this)
      .then(function(data) {
        return new this(data);
      });
    }),

    calculateInstallments: Promise.method(function(options) {
      return this.pagarme.request({
        path: this._options.path + '/calculate_installments_amount',
        method: 'GET',
        query: options
      })
      .bind(this)
      .then(function(data) {
        return new this(data);
      });
    })

  }
})
.on('beforeCreate', beforeCreate);

module.exports = Transaction;
