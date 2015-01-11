'use strict';

var _            = require('lodash')
  , assert       = require('assert')
  , Promise      = require('bluebird');

function PagarmeResource(data) {
  _.extend(this, data);
}

PagarmeResource.findBy = Promise.method(function(options) {
  options = options || {};
  this.emit('preFind', options);
  return this.pagarme.request(_.extend({
    path: this._options.template(options),
    query: options
  }, options))
  .bind(this)
});

PagarmeResource.findById = Promise.method(function(id) {
  return this.pagarme.request(_.extend({
    path: this._options.path + '/' + id,
    query: { id: id }
  }))
  .bind(this)
});

PagarmeResource.create = Promise.method(function(options) {
  options = options || {};
  var create = this.pagarme.request(_.extend({
    path: this._options.path,
    method: 'POST',
    query: options
  }), options)
  .bind(this);
  this.emit('preCreate', this.pagarme, options, create);
  return create;
});

PagarmeResource.update = Promise.method(function(id, options) {
  options = options || {};
  return this.pagarme.request(_.extend({
    path: this._options.path + '/' + id,
    method: 'PUT',
    query: options
  }), options)
  .bind(this)
});

module.exports = PagarmeResource;
