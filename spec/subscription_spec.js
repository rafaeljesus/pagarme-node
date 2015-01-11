/* jshint -W030 */

'use strict';

var expect        = require('chai').use(require('chai-as-promised')).expect
  , nock          = require('nock')
  , _             = require('lodash')
  , pagarme       = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Plan          = pagarme.Plan
  , Subscription  = pagarme.Subscription;

describe('Subscription', function() {

  var planFixture, cardFixture, options;

  before(function() {
    options = { postback_url: 'http://test.com/postback',  customer: { email: 'customer@pagar.me' } };
    cardFixture = require('./fixtures/card');
    planFixture = require('./fixtures/plan');
  });

  after(nock.cleanAll);

  it('should create subscription with plan', function() {
    Plan.create(planFixture)
      .then(function(obj) {
        var subscription = _.extend(cardFixture, options)
          , with_plan = _.extend({ plan_id: obj.id }, subscription);
        return Subscription.create(with_plan);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });

  it('should create subscription with plan and unbsaved card', function() {
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
      })
      .catch(function(err) {
        // console.log(err);
      });
  });

});
