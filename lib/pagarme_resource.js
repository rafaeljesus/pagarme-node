'use strict';

var extend = require('lodash').extend;

function PagarmeResource(data) {
  extend(this, data);
}

PagarmeResource.findBy = function(options, cb) {
  options || (options = {});
  if (this.beforeFind) {
    this.beforeFind.apply(this, [options]);
  }
  var params = extend({
    path: this._options.template(options),
    query: options
  }, options);
  return this.pagarme.request(params, cb);
};

PagarmeResource.findById = function(id, cb) {
  var params = extend({
    path: this._options.path + '/' + id,
    query: {id: id}
  });
  return this.pagarme.request(params, cb);
};

PagarmeResource.create = function(options, cb) {
  options || (options = {});

  var params = extend({
    path: this._options.path,
    method: 'POST',
    query: options
  }, options);

  if (this.beforeCreate) {
    this.beforeCreate.apply(this, [this.pagarme, params, cb]);
  } else {
    return this.pagarme.request(params, cb);
  }
};

PagarmeResource.update = function(id, options, cb) {
  options || (options = {});

  var params = extend({
    path: this._options.path + '/' + id,
    method: 'PUT',
    query: options
  }, options);

  return this.pagarme.request(params, cb);
};

module.exports = PagarmeResource;
