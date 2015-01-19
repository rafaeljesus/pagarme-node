'use strict';

var extend       = require('lodash').extend;

function PagarmeResource(data) {
  extend(this, data);
}

PagarmeResource.findBy = function(options, cb) {
  options = options || {};
  this.emit('preFind', options);
  var params = extend({
    path: this._options.template(options),
    query: options
  }, options);
  this.pagarme.request(params, cb);
};

PagarmeResource.findById = function(id, cb) {
  var params = extend({
    path: this._options.path + '/' + id,
    query: { id: id }
  });
  this.pagarme.request(params, cb);
};

PagarmeResource.create = function(options, cb) {
  options = options || {};
  var params = extend({
    path: this._options.path,
    method: 'POST',
    query: options
  }, options);
  if (this.listeners('preCreate')) {
    this.emit('preCreate', this.pagarme, params, cb);
  } else {
    this.pagarme.request(params, cb);
  }
};

PagarmeResource.update = function(id, options, cb) {
  options = options || {};
  var params = extend({
    path: this._options.path + '/' + id,
    method: 'PUT',
    query: options
  }, options);
  this.pagarme.request(params, cb);
};

module.exports = PagarmeResource;
