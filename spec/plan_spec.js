/* jshint -W030 */

'use strict';

var async     = require('async')
  , expect    = require('chai').use(require('chai-as-promised')).expect
  , pagarme   = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan      = pagarme.Plan;

describe('Plan', function() {

  var planFixture;

  beforeEach(function() {
    planFixture = require('./fixtures/plan');
  });

  it('should create a plan', function(done) {
    Plan.create(planFixture, function(err, res) {
      if (err) { return done(err); }
      expect(res.id).to.be.ok;
      done();
    });
  });

  it('should find by id', function(done) {
    async.seq(function(next) {
      Plan.create(planFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      Plan.findById(res.id, function(err, res) {
        expect(res.id).to.be.ok;
        done();
      });
    })();
  });

  it('should search plan by criteria', function(done) {
    async.seq(function(next) {
      Plan.create(planFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      var options = { trial_days: res.trial_days, page: 1, count: 10 };
      Plan.findBy(options, function(err, res) {
        if (err) { return done(err); }
        Object.keys(res).map(function(key) {
          expect(res[key]).to.be.property('trial_days', 5);
        });
        done();
      });
    })();
  });

  describe('validate', function() {
    it('should not accept amount as negative number', function(done) {
      Plan.create({ amount: -1 }, function(err) {
        expect(err.type[0].parameter_name).to.be.equal('amount');
        done();
      });
    });

    it('should not accept days as negative number', function(done) {
      Plan.create({ amount: 1000, days: -1 }, function(err) {
        expect(err.type[0].parameter_name).to.be.equal('days');
        done();
      });
    });

    it('should not accept days as string', function(done) {
      var options = { amount: 1000, days: 30, name: 'Gold Plan' };
      async.seq(function(next) {
        Plan.create(options, function(err, res) {
          expect(err).to.be.null;
          next(null, res);
        });
      }, function(res) {
        Plan.update(res.id, { days: 'Gold Plan' }, function(err, res) {
          expect(err.type[0].parameter_name).to.be.equal('days');
          done();
        });
      })();
    });

    it('should require name', function(done) {
      Plan.create({ amount: 1000, days: 30 }, function(err, res) {
        expect(err.type[0].parameter_name).to.be.equal('name');
        done();
      });
    });
  });
});
