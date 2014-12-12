'use strict';

var _               = require('lodash')
  , EventEmitter    = require('events').EventEmitter
  , createError     = require('create-error')
  , Promise         = require('bluebird')
  , PagarmeResource = require('./pagarme_resource');

function Resource() {
  PagarmeResource.apply(this, arguments);
};

function createErrors(name) {
  return {
    ValidationError: createError(name + 'ValidationError'),
    UnknownError: createError(name + 'UnknownError')
  }
}

Resource.create = function(name, options) {
  _.extend(Resource, new EventEmitter(), EventEmitter.prototype, PagarmeResource, createErrors(name), options.classMethods, {
    _name: name,
    _options: _.extend({}, options, {
      template: _.template(options.path)
    })
  });

  return _.extend(function(pagarme) {
    return _.extend(Resource, {
      pagarme: pagarme
    });
  },
  {
    on: function() {
      Resource.on.apply(Resource, arguments);
      return this;
    }
  });
};

module.exports = Resource;
