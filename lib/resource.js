'use strict';

var _            = require('lodash')
  , Promise      = require('bluebird');

function PagarmeResource(data) {
  _.extend(this, data);
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

exports.create = function(name, options) {
  var Resource = function() {
    PagarmeResource.apply(this, arguments);
  };

  _.extend(Resource, PagarmeResource, {
    _name: name,
    _options: _.extend({}, options, {
      template: _.template(options.path)
    })
  });

  return _.extend(function(pagarme) {
    return _.extend(Resource, {
      pagarme: pagarme
    });
  });
};
