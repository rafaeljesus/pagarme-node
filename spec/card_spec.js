/* jshint -W030 */

'use strict';

var expect      = require('chai').use(require('chai-as-promised')).expect
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Card        = pagarme.Card;

describe('Card', function() {

  var cardFixture;

  beforeEach(function() {
    cardFixture = require('./fixtures/card');
  });

  it('should create a card', function(done) {
    Card.create(cardFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should update a card', function(done) {
    var card_holder_name = '4901720080344449';
    Card.create(cardFixture)
      .then(function(obj) {
        return Card.update(obj.id, { card_holder_name: card_holder_name });
      })
      .then(function(obj) {
        expect(obj.card_holder_name).to.be.equal(card_holder_name);
        done();
      });
  });

  it('should find by id', function(done) {
    Card.create(cardFixture)
      .then(function(obj) {
        return Card.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should search by criteria', function(done) {
    var query = { card: { brand: 'visa' }, page: 1, count: 10 };
    Card.findBy(query)
      .then(function(cards) {
        Object.keys(cards).map(function(key) {
          expect(cards[key]).to.have.property('brand', 'visa');
        });
        done();
      });
  });
});
