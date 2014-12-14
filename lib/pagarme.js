'use strict';

var assert      = require('assert')
  , util        = require('util')
  , fs          = require('fs')
  , _           = require('lodash')
  , createError = require('create-error')
  , http        = require('http')
  , Promise     = require('bluebird')
  , needle      = Promise.promisifyAll(require('needle'))
  , crypto      = require('crypto');

function Pagarme(config) {
  config = config || {};
  assert(this instanceof Pagarme, 'Pagarme must be called with new');
  assert(!!config.key, 'You need to configure a API key before performing requests.');
  this.key = config.key;
  this.cardEncryptionPubKey = fs.readFileSync('certs/public_key.pem', 'utf8');
  this.endpoint = 'https://api.pagar.me/%s';
  this.Card = require('./card')(this);
  this.BankAccount = require('./bank_account')(this);
  this.Plan = require('./plan')(this);
  this.Transaction = require('./transaction')(this);
}

function generateQuery() {
  var query = _.omit(_.extend.apply(_, [{}].concat([].slice.apply(arguments))), _.isUndefined);
  return _.isEmpty(query) ? undefined : query;
};

Pagarme.prototype.base = function(options) {
  options = _.defaults(options, { version: '1' });
  return util.format.apply(util, [this.endpoint, options.version]);
};

Pagarme.prototype.url = function(options) {
  _.defaults(options, { path: '' });
  return this.base(options) + options.path;
};

Pagarme.prototype.request = function(options) {
  options = _.defaults(options, { method: 'GET', query: {} });
  var requestParams = generateQuery({ api_key: this.key }, options.query);
  return needle
    .requestAsync(options.method, this.url(options), requestParams, { json: true, timeout: 6000 })
    .bind(this)
    .spread(function(res, body) {
      if (res.statusCode !== 202 && res.statusCode < 400) return body;
      throw _.extend(new this.PagarmeError('Pagarme Error'), {
        type: body.errors || 'unknown',
        body: body,
        statusCode: res.statusCode
      });
    });
};

Pagarme.prototype.validateFingerprint = function(id, fingerprint) {
  var hash = id + '#' + crypto.createHash('sha1').digest('hex') + this.key;
  return hash == fingerprint;
};

Pagarme.PagarmeError = Pagarme.prototype.PagarmeError = createError('PagarmeError');

module.exports = Pagarme;
