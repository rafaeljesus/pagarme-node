/* jshint -W030 */

'use strict';

var async       = require('async')
  , expect      = require('chai').expect
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Card        = pagarme.Card;

describe('Card', function() {

  var cardFixture;

  beforeEach(function() {
    cardFixture = require('./fixtures/card');
  });

  it('should create a card', function(done) {
    Card.create(cardFixture, function(err, res) {
      expect(res.id).to.be.ok;
      done();
    });
  });

  it('should find by id', function(done) {
    async.seq(function(next) {
      Card.create(cardFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      Card.findById(res.id, function(err, res) {
        expect(res.id).to.be.ok;
        done();
      });
    })();
  });
});
