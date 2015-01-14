/* jshint -W030 */

'use strict';

var expect        = require('chai').use(require('chai-as-promised')).expect
  , _             = require('lodash')
  , pagarme       = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan          = pagarme.Plan
  , Card          = pagarme.Card
  , Subscription  = pagarme.Subscription;

describe('Subscription', function() {

  var planFixture, subscriptionFixture, cardFixture;

  beforeEach(function() {
    cardFixture = require('./fixtures/card');
    subscriptionFixture = require('./fixtures/subscription');
    planFixture = require('./fixtures/plan');
  });

  it('should create subscription with plan', function(done) {
    Plan.create(planFixture)
      .then(function(obj) {
        var with_plan = _.extend({ plan_id: obj.id }, subscriptionFixture);
        return Subscription.create(with_plan);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should create subscription without plan', function(done) {
    var without_plan = _.extend(subscriptionFixture, { amount: 2000 });
    Subscription
      .create(without_plan)
      .then(function(obj) {
        expect(obj.current_transaction.amount).to.be.equal(2000);
        return Subscription.charge({ id: obj.id, amount: 2000 });
      })
      .then(function(obj) {
        expect(obj.amount).to.be.equal(2000);
        expect(obj.installments).to.be.equal(1);
        done();
      });
  });

  it('should create subscription with plan and unsaved card', function(done) {
    Plan.create(planFixture)
      .then(function(obj) {
        var withUnsavedCard = {
          postback_url: 'http://test.com/postback',
          payment_method: 'credit_card',
          card: cardFixture,
          plan_id: obj.id,
          customer: {
            email: 'customer@pagar.me'
          }
        };
        return Subscription.create(withUnsavedCard);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  /**
  * FIXME Card#create returns a incomplete json from pagarme api, so it throws a
  * exception on Subscription#create
  * { object: 'card',
  *   id: 'card_ci1tkoo2o0004l2164nmpr2pg',
  *   date_created: '2014-10-28T18:13:18.000Z',
  *   date_updated: '2014-10-28T18:13:18.000Z',
  *   brand: 'visa',
  *   holder_name: 'Jose da Silva',
  *   first_digits: '411111',
  *   last_digits: '1111',
  *   fingerprint: 'aRU5WABBRzZf',
  *   customer: null,
  *   valid: true }
  * */
  it('should create subscription with plan and saved card', function(done) {
    var plan;
    Plan.create(planFixture)
      .then(function(obj) {
        plan = obj;
        return Card.create(cardFixture);
      })
      .then(function(card) {
        var options = {
          postback_url: 'http://test.com/postback',
          payment_method: 'credit_card',
          card: card,
          plan_id: plan.id,
          customer: {
            email: 'customer@pagar.me'
          }
        };
        return Subscription.create(options);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should create subscription without plan and charge with installments', function(done) {
    var without_plan = _.extend(subscriptionFixture, { amount: 2000, installments: 6 });
    Subscription
      .create(without_plan)
      .then(function(obj) {
        var options = { id: obj.id, amount: 1500, installments: 3 };
        return Subscription.charge(options);
      })
      .then(function(obj) {
        expect(obj.amount).to.be.equal(1500);
        expect(obj.installments).to.be.equal(3);
        done();
      });
  });

});
