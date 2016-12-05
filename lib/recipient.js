'use strict'

const resource = require('./resource')
const assertPageCount = require('./assert_page_count').assert

module.exports = resource.create('Recipient', {
  path: '/recipients',
  beforeFind: assertPageCount,

  classMethods: {
    balance: function (id, cb) {
      const params = {
        path: this._options.path + '/' + id + '/balance',
        method: 'GET',
        query: {id: id}
      }

      return this.pagarme.request(params, cb)
    }
  }
})

