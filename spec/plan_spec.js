/* jshint -W030 */

'use strict'

const async = require('async')
const expect = require('chai').expect
const pagarme = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
const Plan = pagarme.Plan

describe('Plan', () => {
  let planFixture

  beforeEach(() => {
    planFixture = require('./fixtures/plan')
  })

  it('should create a plan', (done) => {
    Plan.create(planFixture, (err, res) => {
      if (err) return done(err)
      expect(res.id).to.be.ok
      done()
    })
  })

  it('should find by id', (done) => {
    async.seq((next) => {
      Plan.create(planFixture, (err, res) => {
        expect(err).to.be.null
        next(null, res)
      })
    }, (res) => {
      Plan.findById(res.id, (err, res) => {
        expect(res.id).to.be.ok
        done()
      })
    })()
  })

  it('should search plan by criteria', (done) => {
    async.seq((next) => {
      Plan.create(planFixture, (err, res) => {
        expect(err).to.be.null
        next(null, res)
      })
    }, (res) => {
      const options = {
        trial_days: res.trial_days,
        page: 1,
        count: 10
      }
      Plan.findBy(options, (err, res) => {
        if (err) return done(err)
        Object.keys(res).map((key) => {
          expect(res[key]).to.be.property('trial_days', 5)
        })
        done()
      })
    })()
  })

  describe('validate', () => {
    it('should not accept amount as negative number', (done) => {
      Plan.create({amount: -1}, (err) => {
        expect(err.type[0].parameter_name).to.be.equal('amount')
        done()
      })
    })

    it('should not accept days as negative number', (done) => {
      Plan.create({amount: 1000, days: -1}, (err) => {
        expect(err.type[0].parameter_name).to.be.equal('days')
        done()
      })
    })

    it('should not accept days as string', (done) => {
      const options = {amount: 1000, days: 30, name: 'Gold Plan'}
      async.seq((next) => {
        Plan.create(options, (err, res) => {
          expect(err).to.be.null
          next(null, res)
        })
      }, (res) => {
        Plan.update(res.id, {days: 'Gold Plan'}, (err, res) => {
          expect(err.type[0].parameter_name).to.be.equal('days')
          done()
        })
      })()
    })

    it('should require name', (done) => {
      Plan.create({amount: 1000, days: 30}, (err, res) => {
        expect(err.type[0].parameter_name).to.be.equal('name')
        done()
      })
    })
  })
})
