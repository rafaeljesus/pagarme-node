'use strict';

var expect      = require('chai').use(require('chai-as-promised')).expect
  , nock        = require('nock')
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Card        = pagarme.Card;

describe('Card', function() {

  var cardFixture;

  before(function() {
    cardFixture = require('./fixtures/card');
  });

  after(nock.cleanAll);

  it('should create a card', function() {
    Card.create(cardFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });

  it('should find by id', function() {
    Card.create(cardFixture)
      .then(function(obj) {
        return Card.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });
});
