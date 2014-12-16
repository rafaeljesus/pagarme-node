'use strict';

var expect    = require('chai').expect
  , crypto    = require('crypto')
  , client    = require('../')
  , Pagarme   = client.Pagarme;

describe('Pagarme', function() {

  var pagarme, key = 'ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo';

  beforeEach(function() {
    pagarme = client(key);
  });

  it('should be called with new', function() {
    expect(Pagarme).to.throw(/called with new/);
  });

  it('should provide an API key', function() {
    expect(function() {
      return new Pagarme();
    }).to.throw(/API key/);
  });

  it('should configure the API key', function() {
    expect(new Pagarme({ key: key })).to.have.property('key', key);
  });

  it('should read card encryption public key permission', function() {
    expect(pagarme.cardEncryptionPubKey).to.be.ok;
  });

  it('should validate Fingerprint', function() {
    var validFingerprint = pagarme.validateFingerprint(123, '123#' + crypto.createHash('sha1').digest('hex') + pagarme.key);
    expect(validFingerprint).to.be.true;
  });

});
