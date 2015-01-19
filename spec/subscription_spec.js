/* jshint -W030 */

'use strict';

var async         = require('async')
  , expect        = require('chai').use(require('chai-as-promised')).expect
  , extend        = require('lodash').extend
  , pagarme       = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan          = pagarme.Plan
  // , Card          = pagarme.Card
  , Subscription  = pagarme.Subscription;

describe('Subscription', function() {

  var planFixture, subscriptionFixture, cardFixture;

  beforeEach(function() {
    cardFixture = require('./fixtures/card');
    subscriptionFixture = require('./fixtures/subscription');
    planFixture = require('./fixtures/plan');
  });

  it('should create subscription with plan', function(done) {
    async.seq(function(next) {
      Plan.create(planFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
        var with_plan = extend({ plan_id: res.id }, subscriptionFixture);
        Subscription.create(with_plan, function(err, res) {
          expect(res.id).to.be.ok;
          done();
        });
    })();
  });

  it('should create subscription without plan', function(done) {
    var without_plan = extend(subscriptionFixture, { amount: 2000 });
    async.seq(function(next) {
      Subscription.create(without_plan, function(err, res) {
        expect(err).to.be.null;
        expect(res.current_transaction.amount).to.be.equal(2000);
        next(null, res);
      });
    }, function(res) {
      var options = { id: res.id, amount: 2000 };
      Subscription.charge(options, function(err, res) {
        expect(res.amount).to.be.equal(2000);
        expect(res.installments).to.be.equal(1);
        done();
      });
    })();
  });

  it('should create subscription with plan and unsaved card', function(done) {
    async.seq(function(next) {
      Plan.create(planFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      var withUnsavedCard = {
        postback_url: 'http://test.com/postback',
        payment_method: 'credit_card',
        plan_id: res.id,
        customer: {
          email: 'customer@pagar.me'
        }
      };
      var options = extend(withUnsavedCard, cardFixture);
      Subscription.create(options, function(err, res) {
        expect(res.id).to.be.ok;
        done();
      });
    })();
  });

  /**
  * FIXME Card#create returns a incomplete json from pagarme api, so it throws a
  * exception on Subscription#create
  */
  /*it('should create subscription with plan and saved card', function(done) {
    async.seq(function(next) {
      Plan.create(planFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, next, res);
      });
    }, function(next, plan) {
      Card.create(cardFixture, function(err, card) {
        expect(err).to.be.null;
        next(null, plan, card);
      });
    }, function(plan, card) {
      var withPlanAndCard = {
          postback_url: 'http://test.com/postback',
          payment_method: 'credit_card',
          card: card,
          plan_id: plan.id,
          customer: {
            email: 'customer@pagar.me'
          }
        };
        Subscription.create(withPlanAndCard, function(err, res) {
          expect(err).to.be.null;
          expect(res.id).to.be.ok;
          done();
        });
    })();
  });

  it('should create subscription without plan and charge with installments', function(done) {
    async.seq(function(next) {
      var without_plan = extend(subscriptionFixture, { amount: 2000, installments: 6 });
      Subscription.create(without_plan, function(err, res) {
        expect(err).to.be.null;
        next(null, plan, card);
      });
    }, function(res) {
      var options = { id: res.id, amount: 1500, installments: 3 };
      Subscription.charge(options, function(err, res) {
        expect(res.amount).to.be.equal(1500);
        expect(res.installments).to.be.equal(3);
        done();
      });
    })
  });*/
});
