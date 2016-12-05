'use strict'

const expect = require('chai').expect
const pagarme_resource = require('../lib/pagarme_resource')

describe('PagarmeResource', () => {
  it('should expose base promisses', () => {
    const methods = ['findBy', 'findById', 'create', 'update']
    methods.forEach((method) => {
      expect(pagarme_resource).itself.to.respondTo(method)
    })
  })
})
