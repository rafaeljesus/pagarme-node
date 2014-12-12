'use strict';

var _            = require('lodash')
  , Promise      = require('bluebird');

function PagarmeResource(data) {
  _.extend(this, data);
}

function isValidationError(err) {
  return err.type instanceof Array;
}

PagarmeResource.findBy = Promise.method(function(options) {
  options = options || {};
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
  var self = this;
  function create() {
    return self.pagarme.request(_.extend({
      path: self._options.path,
      method: 'POST',
      query: options
    }), options)
    .then(function(data) {
      return new self(data);
    })
    .catch(isValidationError, function() {
      throw new self.ValidationError(self._name + ' validation error');
    })
    .catch(function(err) {
      throw new self.UnknownError(self._name + ' ' + err);
    });
  }
  this.emit('beforeCreate', options, create);
});

module.exports = PagarmeResource;
