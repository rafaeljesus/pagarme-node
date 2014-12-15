'use strict';

var _            = require('lodash')
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
  .then(function(data) {
    return new this(data);
  });
});

PagarmeResource.findById = Promise.method(function(id) {
  return this.pagarme.request(_.extend({
    path: this._options.path + '/' + id,
    query: { id: id }
  }))
  .bind(this)
  .then(function(data) {
    return new this(data);
  });
});

PagarmeResource.create = Promise.method(function(options) {
  options = options || {};
  var request = this.pagarme.request(_.extend({
    path: this._options.path,
    method: 'POST',
    query: options
  }), options)
  .bind(this);
  return request.then(function(data) {
    return new this(data);
  });
  this.emit('preCreate', options, request);
});

PagarmeResource.update = Promise.method(function(id, options) {
  options = options || {};
  return this.pagarme.request(_.extend({
    path: this._options.path + '/' + id,
    method: 'PUT',
    query: options
  }), options)
  .bind(this)
  .then(function(data) {
    return new this(data);
  });
});

module.exports = PagarmeResource;
