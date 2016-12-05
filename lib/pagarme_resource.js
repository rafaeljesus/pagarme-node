'use strict'

const extend = require('lodash').extend

module.exports = PagarmeResource

function PagarmeResource (data) {
  extend(this, data)
}

PagarmeResource.findBy = function (options = {}, cb) {
  if (this.beforeFind) {
    this.beforeFind.apply(this, [options])
  }

  const params = extend({
    path: this._options.template(options),
    query: options
  }, options)

  return this.pagarme.request(params, cb)
}

PagarmeResource.findById = function (id, cb) {
  const params = extend({
    path: this._options.path + '/' + id,
    query: {id: id}
  })

  return this.pagarme.request(params, cb)
}

PagarmeResource.create = function (options = {}, cb) {
  const params = extend({
    path: this._options.path,
    method: 'POST',
    query: options
  }, options)

  if (this.beforeCreate) {
    this.beforeCreate.apply(this, [this.pagarme, params, cb])
  } else {
    return this.pagarme.request(params, cb)
  }
}

PagarmeResource.update = function (id, options = {}, cb) {
  const params = extend({
    path: this._options.path + '/' + id,
    method: 'PUT',
    query: options
  }, options)

  return this.pagarme.request(params, cb)
}
