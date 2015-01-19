'use strict';

var assert          = require('assert')
  , extend          = require('lodash').extend
  , template        = require('lodash').template
  , EventEmitter    = require('events').EventEmitter
  , PagarmeResource = require('./pagarme_resource');

exports.create = function(name, options) {
  assert(typeof name == 'string', 'You need to provide a resource name');
  assert(!!options.path, 'You need to provide a resource path');

  var Resource = function() {
    PagarmeResource.apply(this, arguments);
  };

  extend(Resource, new EventEmitter(), EventEmitter.prototype, PagarmeResource, options.classMethods, {
    _name: name,
    _options: extend({}, options, {
      template: template(options.path)
    })
  });

  return extend(function(pagarme) {
    return extend(Resource, {
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
