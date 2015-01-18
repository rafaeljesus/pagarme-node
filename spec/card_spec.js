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
});
