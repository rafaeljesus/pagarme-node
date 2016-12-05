/* jshint -W030 */

'use strict'

const expect = require('chai').expect
const CardHash = require('../lib/card_hash')
const pagarme = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')

describe('CardHash', () => {
  it('should create card hash', (done) => {
    const params = {
      path: '/transactions',
      method: 'POST',
      query: require('./fixtures/transaction')
    }
    CardHash.create(pagarme, params, (err, res) => {
      expect(err).to.be.null
      done()
    })
  })
})
