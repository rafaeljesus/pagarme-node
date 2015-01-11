'use strict';

var expect        = require('chai').use(require('chai-as-promised')).expect
  , nock          = require('nock')
  , _             = require('lodash')
  , pagarme       = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan          = pagarme.Plan
  , Subscription  = pagarme.Subscription;

describe('Subscription', function() {

  var subscriptionFixture, planFixture, cardFixture;

  before(function() {
    var options = { postback_url: 'http://test.com/postback',  customer: { email: 'customer@pagar.me' } };
    cardFixture = require('./fixtures/card');
    planFixture = require('./fixtures/plan');
    subscriptionFixture = _.extend(options, planFixture);
  });

  after(nock.cleanAll);

  it('should create subscription with plan', function() {
    Plan.create(planFixture)
      .then(function(obj) {
        var with_plan = _.extend({ plan_id: obj.id }, subscriptionFixture);
        return Subscription.create(with_plan);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });

  it('should create subscription with plan and unbsaved card', function() {
    Plan.create(planFixture)
      .then(function(obj) {
        var withUnsavedCard = _.extend(subscriptionFixture, { card: cardFixture });
        return Subscription.create(withUnsavedCard);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });

});
