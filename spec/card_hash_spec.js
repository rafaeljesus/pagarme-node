/* jshint -W030 */

'use strict';

var expect    = require('chai').use(require('sinon-chai')).expect
  , nock      = require('nock')
  , sinon     = require('sinon')
  , CardHash  = require('../lib/card_hash')
  , pagarme   = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo');

describe('CardHash', function() {

  after(nock.cleanAll);

  it('should create card hash', function() {
    var createCallback = sinon.spy();
    CardHash
      .create(pagarme, {}, createCallback)
      .then(function() {
      expect(createCallback).to.have.been.called;
    });
  });

  /*it('should generate card hash', function() {
    pagarme
      .request({ path: '/transactions/card_hash_key' })
      .then(function(data) {
        var card_hash = CardHash.toHash(data, {});
        expect(card_hash).to.be.ok;
      });
  });*/
});
