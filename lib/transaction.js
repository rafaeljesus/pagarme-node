'use strict'

const resource = require('./resource')
const extend = require('lodash').extend
const assertPageCount = require('./assert_page_count').assert
const createCardHash = require('./card_hash').create

module.exports = resource.create('Transaction', {
  path: '/transactions',
  beforeCreate: createCardHash,
  beforeFind: assertPageCount,

  classMethods: {
    refund: function (id, cb) {
      const params = {
        path: this._options.path + '/' + id + '/refund',
        method: 'POST',
        query: {id: id}
      }
      return this.pagarme.request(params, cb)
    },

    capture: function (id, options, cb) {
      const params = extend({
        path: this._options.path + '/' + id + '/capture',
        method: 'POST',
        query: {id: id}
      }, options)
      return this.pagarme.request(params, cb)
    },

    calculateInstallments: function (options, cb) {
      const params = {
        path: this._options.path + '/calculate_installments_amount',
        method: 'GET',
        query: options
      }
      return this.pagarme.request(params, cb)
    }
  }
})
