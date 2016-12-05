/* jshint -W030 */

'use strict'

const async = require('async')
const expect = require('chai').expect
const extend = require('lodash').extend
const pagarme = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
const Plan = pagarme.Plan
// , Card          = pagarme.Card
const Subscription = pagarme.Subscription

describe('Subscription', () => {
  let planFixture
  let subscriptionFixture
  let cardFixture

  beforeEach(() => {
    cardFixture = require('./fixtures/card')
    subscriptionFixture = require('./fixtures/subscription')
    planFixture = require('./fixtures/plan')
  })

  it('should create subscription with plan', (done) => {
    async.seq((next) => {
      Plan.create(planFixture, (err, res) => {
        expect(err).to.be.null
        next(null, res)
      })
    }, (res) => {
        const with_plan = extend({plan_id: res.id}, subscriptionFixture)
        Subscription.create(with_plan, (err, res) => {
          expect(res.id).to.be.ok
          done()
        })
    })()
  })

  it('should create subscription without plan', (done) => {
    const without_plan = extend(subscriptionFixture, {amount: 2000})
    async.seq((next) => {
      Subscription.create(without_plan, (err, res) => {
        expect(err).to.be.null
        expect(res.current_transaction.amount).to.be.equal(2000)
        next(null, res)
      })
    }, (res) => {
      const options = {id: res.id, amount: 2000}
      Subscription.charge(options, (err, res) => {
        expect(res.amount).to.be.equal(2000)
        expect(res.installments).to.be.equal(1)
        done()
      })
    })()
  })

  it('should create subscription with plan and unsaved card', (done) => {
    async.seq((next) => {
      Plan.create(planFixture, (err, res) => {
        expect(err).to.be.null
        next(null, res)
      })
    }, (res) => {
      const withUnsavedCard = {
        postback_url: 'http://test.com/postback',
        payment_method: 'credit_card',
        plan_id: res.id,
        customer: {
          email: 'customer@pagar.me'
        }
      }
      const options = extend(withUnsavedCard, cardFixture)
      Subscription.create(options, (err, res) => {
        expect(res.id).to.be.ok
        done()
      })
    })()
  })

  /* FIXME Card#create returns a incomplete card from pagarme api
  it('should create subscription with plan and saved card', (done) => {
    async.seq((next) => {
      Plan.create(planFixture, (err, res) => {
        expect(err).to.be.null
        next(null, next, res)
      })
    }, (next, plan) => {
      Card.create(cardFixture, (err, card) => {
        expect(err).to.be.null
        next(null, plan, card)
      })
    }, (plan, card) => {
      const withPlanAndCard = {
        postback_url: 'http://test.com/postback',
        payment_method: 'credit_card',
        card: card,
        plan_id: plan.id,
        customer: {
          email: 'customer@pagar.me'
        }
      }
      console.log(card)
      Subscription.create(withPlanAndCard, (err, res) => {
        expect(err).to.be.null
        expect(res.id).to.be.ok
        done()
      })
    })()
  })*/

  /* FIXME timeout
  it('should create subscription without plan and charge with installments', function(done) {
    async.seq(function(next) {
      var without_plan = extend(subscriptionFixture, { amount: 2000, installments: 6 })
      Subscription.create(without_plan, function(err, res) {
        expect(err).to.be.null
        next(null, res)
      })
    }, function(res) {
      var options = { id: res.id, amount: 1500, installments: 3 }
      Subscription.charge(options, function(err, res) {
        expect(res.amount).to.be.equal(1500)
        expect(res.installments).to.be.equal(3)
        done()
      })
    })
  })*/
})
