/* jshint -W030 */

'use strict'

const async = require('async')
const expect = require('chai').expect
const pagarme = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
const Card = pagarme.Card

describe('Card', () => {
  let cardFixture

  beforeEach(() => {
    cardFixture = require('./fixtures/card')
  })

  it('should create a card', (done) => {
    Card.create(cardFixture, (err, res) => {
      expect(res.id).to.be.ok
      done()
    })
  })

  it('should find by id', (done) => {
    async.seq((next) => {
      Card.create(cardFixture, (err, res) => {
        expect(err).to.be.null
        next(null, res)
      })
    }, (res) => {
      Card.findById(res.id, (err, res) => {
        expect(res.id).to.be.ok
        done()
      })
    })()
  })
})
