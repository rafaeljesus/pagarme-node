'use strict'

const _ = require('lodash')
const assertPageCount = require('./assert_page_count').assert
const resource = require('./resource')

module.exports = resource.create('Subscription', {
  path: '/subscriptions',
  beforeFind: assertPageCount,

  classMethods: {
    charge: function (options, cb) {
      options = _.defaults(options, {
        installments: 1
      })

      const params = _.extend({
        path: this._options.path + '/' + options.id + '/transactions',
        method: 'POST',
        query: options
      }, options)

      return this.pagarme.request(params, cb)
    }
  }
})
