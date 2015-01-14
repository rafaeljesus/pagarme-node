/* jshint -W030 */

'use strict';

var expect    = require('chai').use(require('chai-as-promised')).expect
  , pagarme   = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan      = pagarme.Plan;

describe('Plan', function() {

  var planFixture;

  beforeEach(function() {
    planFixture = require('./fixtures/plan');
  });

  it('should create a plan', function(done) {
    Plan.create(planFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should find by id', function(done) {
    Plan.create(planFixture)
      .then(function(obj) {
        return Plan.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should search plan by criteria', function(done) {
    Plan.create(planFixture)
      .then(function(obj) {
        return Plan.findBy({ trial_days: planFixture.trial_days, page: 1, count: 10 });
      })
      .then(function(plans) {
        Object.keys(plans).map(function(key) {
          expect(plans[key]).to.be.property('trial_days', 5);
        });
        done();
      });
  });

  describe('validate', function() {
    it('should not accept amount as negative number', function(done) {
      Plan.create({ amount: -1 })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('amount');
          done();
        });
    });

    it('should not accept days as negative number', function(done) {
      Plan.create({ amount: 1000, days: -1 })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('days');
          done();
        });
    });

    it('should not accept days as string', function(done) {
      Plan
        .create({ amount: 1000, days: 30, name: 'Gold Plan' })
        .then(function(obj) {
          return Plan.update(obj.id, { days: 'Gold Plan' });
        })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('days');
          done();
        });
    });

    it('should require name', function(done) {
      Plan.create({ amount: 1000, days: 30 })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('name');
          done();
        });
    });
  });

});
