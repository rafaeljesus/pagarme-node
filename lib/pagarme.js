'use strict';

var assert      = require('assert');
  , Promise     = require('bluebird')
  , needle      = Promise.promisifyAll(require('needle'));

function Pagarme(config) {
  config = config || {};
  assert(this instanceof Pagarme, 'Pagarme must be called with new');
  assert(!!config.key, 'An API key must be provided');
  this.key = config.key;
  this.endpoint = 'https://api.pagar.me/1';
  this.apiPublicKey = null;
  this.Transaction = require('./transaction')(this);
}

Pagarme.prototype.apiEndpoint;
Pagarme.prototype.apiKey;
Pagarme.prototype.fullApiUrl;
Pagarme.prototype.apiCardEncryptionPublicKey;

module.exports = Pagarme;
