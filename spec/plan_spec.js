'use strict';

var expect    = require('chai').use(require('chai-as-promised')).expect
  , nock      = require('nock')
  , pagarme   = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan      = pagarme.Plan;

describe('Plan', function() {

  var planFixture;

  before(function() {
    planFixture = require('./fixtures/plan');
  });

  after(nock.cleanAll);

  it('should create a plan', function() {
    Plan.create(planFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });

  it('should search plan by criteria', function() {
    Plan.create(planFixture)
      .then(function(obj) {
        return Plan.findBy({ trial_days: planFixture.trial_days });
      })
      .then(function(plans) {
        Object.keys(plans).map(function(key) {
          expect(plans[key].trial_days).to.be.equal(parseInt(planFixture.trial_days));
        });
      });
  });

  describe('should validate', function() {
    it('amount', function() {
      Plan.create({ amount: -1 })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('amount');
        });
    });

    it('days as negative number', function() {
      Plan.create({ amount: 1000, days: -1 })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('days');
        });
    });

    it('days as string', function() {
      Plan
        .create({ amount: 1000, days: 30, name: 'Gold Plan' })
        .then(function(obj) {
          return Plan.update(obj.id, { days: 'Gold Plan' });
        })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('days');
        });
    });

    it('name', function() {
      Plan.create({ amount: 1000, days: 30 })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('name');
        });
    });
  });

});
