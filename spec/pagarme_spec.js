/* jshint -W030 */

'use strict'

const expect = require('chai').expect
const crypto = require('crypto')
const client = require('../')
const Pagarme = client.Pagarme

describe('Pagarme', () => {
  const key = 'ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo'

  let pagarme

  beforeEach(() => {
    pagarme = client(key)
  })

  describe('constructor', () => {
    it('should be called with new', () => {
      expect(Pagarme).to.throw(/called with new/)
    })

    it('should provide an API key', () => {
      expect(() => new Pagarme()).to.throw(/API key/)
    })

    it('should configure the API key', () => {
      expect(new Pagarme({key: key})).to.have.property('key', key)
    })

    it('should compose models access', () => {
      expect(pagarme.Card).to.be.ok
      expect(pagarme.BankAccount).to.be.ok
      expect(pagarme.Plan).to.be.ok
      expect(pagarme.Transaction).to.be.ok
    })

    it('should validate Fingerprint', () => {
      const validFingerprint = pagarme.validateFingerprint(123, '123#' + crypto.createHash('sha1').digest('hex') + pagarme.key)
      expect(validFingerprint).to.be.true
    })
  })

  describe('request', () => {
    it('should send a get request to specified endpoint', (done) => {
      const body = {
        customer: {
          document_number: 36433809847
        },
        page: 1,
        count: 10
      }
      const options = {path: '/transactions', query: body}
      pagarme.request(options, (err, transactions) => {
        if (err) return done(err)
        Object.keys(transactions).map((key) => {
          expect(transactions[key].customer).to.have.property('document_number', '36433809847')
        })
        done()
      })
    })

    it('should return PagarmeError', (done) => {
      pagarme.request({path: '/unknow_path'}, (err) => {
        expect(err.type).to.deep.equal([{type: 'not_found', parameter_name: null, message: 'URL inválida.'}])
        expect(err.statusCode).to.equal(404)
        done()
      })
    })
  })
})
