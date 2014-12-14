'use strict';

var _               = require('lodash')
  , EventEmitter    = require('events').EventEmitter
  , PagarmeResource = require('./pagarme_resource');

exports.create = function(name, options) {
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
