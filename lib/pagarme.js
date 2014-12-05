'use strict';

var assert      = require('assert')
  , crypto      = require('crypto');

function Pagarme(config) {
  config = config || {};
  assert(this instanceof Pagarme, 'Pagarme must be called with new');
  assert(!!config.key, 'An API key must be provided');
  // this.Transaction = require('./transaction')(this);
  this.key = config.key;
  this.endpoint = 'https://api.pagar.me/1';
  this.cardEncryptionPubKey = null;
  this.verion = '1';
}

Pagarme.prototype.validateFingerprint = function(id, fingerprint) {
  var hash = id + '#' + crypto.createHash('sha1').digest('hex') + this.key;
  return hash == fingerprint;
};

module.exports = Pagarme;
