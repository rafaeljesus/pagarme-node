/* jshint -W030 */

'use strict'

const async = require('async')
const expect = require('chai').expect
const pagarme = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
const BankAccount = pagarme.BankAccount

describe('BankAccount', () => {
  let bankAccountFixture

  beforeEach(() => {
    bankAccountFixture = require('./fixtures/bank_account')
  })

  it('should create a bank account', (done) => {
    BankAccount.create(bankAccountFixture, (err, res) => {
      expect(res.id).to.be.ok
      done()
    })
  })

  it('should find by id', (done) => {
    async.seq((next) => {
      BankAccount.create(bankAccountFixture, (err, res) => {
        expect(err).to.be.null
        next(null, res)
      })
    }, (res) => {
      BankAccount.findById(res.id, (err, res) => {
        expect(res.id).to.be.ok
        done()
      })
    })()
  })

  it('should search by criteria', (done) => {
    const query = {bank_account: {agencia: 1935 }, page: 1, count: 10}
    BankAccount.findBy(query, (err, accounts) => {
      Object.keys(accounts).map((key) => {
        expect(accounts[key]).to.have.property('agencia', '1935')
      })
      done()
    })
  })
})
