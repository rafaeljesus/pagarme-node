'use strict';

var extend       = require('lodash').extend
  , Promise      = require('bluebird');

function PagarmeResource(data) {
  _.extend(this, data);
}

PagarmeResource.findBy = function(options, cb) {
  options = options || {};
  this.emit('preFind', options);
  var params = extend({
    path: this._options.template(options),
    query: options
  }, options);
  this.pagarme.request(params, function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });
};

PagarmeResource.findById = function(id, cb) {
  var params = extend({
    path: this._options.path + '/' + id,
    query: { id: id }
  });
  this.pagarme.request(params, function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });
};

PagarmeResource.create = function(options, cb) {
  options = options || {};
  var params = extend({
    path: this._options.path,
    method: 'POST',
    query: options
  }, options);
  this.pagarme.request(params, function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });
};

PagarmeResource.update = function(id, options, cb) {
  options = options || {};
  var params = extend({
    path: this._options.path + '/' + id,
    method: 'PUT',
    query: options
  }, options);
  this.pagarme.request(params, function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });
};

module.exports = PagarmeResource;
