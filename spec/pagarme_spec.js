/* jshint -W030 */

'use strict';

var expect    = require('chai').use(require('chai-as-promised')).expect
  , crypto    = require('crypto')
  , client    = require('../')
  , Pagarme   = client.Pagarme;

describe('Pagarme', function() {

  var pagarme, key = 'ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo';

  beforeEach(function() {
    pagarme = client(key);
  });

  describe('constructor', function() {
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

    it('should compose models access', function() {
      expect(pagarme.Card).to.be.ok;
      expect(pagarme.BankAccount).to.be.ok;
      expect(pagarme.Plan).to.be.ok;
      expect(pagarme.Transaction).to.be.ok;
    });

    it('should validate Fingerprint', function() {
      var validFingerprint = pagarme.validateFingerprint(123, '123#' + crypto.createHash('sha1').digest('hex') + pagarme.key);
      expect(validFingerprint).to.be.true;
    });
  });

  describe('request', function() {
    it('should send a get request to specified endpoint', function(done) {
      var body = { customer: { document_number:  36433809847 }, page: 1, count: 10 };
      var options = { path: '/transactions', query: body };
      pagarme.request(options, function(err, transactions) {
        if (err) return done(err);
        Object.keys(transactions).map(function(key) {
          expect(transactions[key].customer).to.have.property('document_number', '36433809847');
        });
        done();
        });
    });

    it('should return PagarmeError', function(done) {
      pagarme.request({ path: '/unknow_path' }, function(err) {
        expect(err.type).to.deep.equal([{ type: 'not_found', parameter_name: null, message: 'URL inválida.' }]);
        expect(err.statusCode).to.equal(404);
        done();
      });
    });
  });
});
