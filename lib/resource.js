'use strict';

var assert          = require('assert')
  , _               = require('lodash')
  , EventEmitter    = require('events').EventEmitter
  , PagarmeResource = require('./pagarme_resource');

exports.create = function(name, options) {
  assert(typeof name == 'string', 'You need to provide a resource name');
  assert(!!options.path, 'You need to provide a resource path');

  var Resource = function() {
    PagarmeResource.apply(this, arguments);
  };

  _.extend(Resource, new EventEmitter(), EventEmitter.prototype, PagarmeResource, options.classMethods, {
    _name: name,
    _options: _.extend({}, options, {
      template: _.template(options.path)
    })
  })

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
