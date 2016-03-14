/* jshint -W030 */

'use strict';

var async       = require('async')
  , expect      = require('chai').expect
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Recipient = pagarme.Recipient;

describe('Recipient', function() {

  var recipientFixture;

  beforeEach(function() {
    recipientFixture = require('./fixtures/recipient');
  });

  it('should compose classMethods', function() {
    var classMethods = ['balance'];
    classMethods.forEach(function (name) {
      expect(Recipient).itself.to.respondTo(name);
    });
  });

  it('should create a recipient', function(done) {
    Recipient.create(recipientFixture, function(err, res) {
      expect(res.id).to.be.ok;
      done();
    });
  });

  it('should check balance of recipient', function (done) {
    async.seq(function (next) {
      Recipient.create(recipientFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function (res) {
      Recipient.balance(res.id, function (err, res) {
        if (err) return done(err);

        expect(res.waiting_funds).to.have.property('amount', 0);
        expect(res.available).to.have.property('amount', 0);
        expect(res.transferred).to.have.property('amount', 0);
        done();
      });
    })();
  });

  it('should find by id', function(done) {
    async.seq(function(next) {
      Recipient.create(recipientFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      Recipient.findById(res.id, function(err, res) {
        expect(res.id).to.be.ok;
        done();
      });
    })();
  });

  it('should search by criteria', function(done) {
    var query = { recipient: { bank_account: { agencia: 1935 } }, page: 1, count: 10 };
    Recipient.findBy(query, function(err, recipients) {
      Object.keys(recipients).map(function(key) {
        expect(recipients[key]).to.have.property('bank_account');
        expect(recipients[key].bank_account).to.have.property('agencia', '1935');
      });
      done();
    });
  });

  it('should update a recipient', function (done) {
    async.seq(function (next) {
      Recipient.create(recipientFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function (res) {
      Recipient.update(res.id, { transfer_interval: 'monthly' }, function (err, res) {
        if (err) return done(err);

        expect(res).to.have.property('transfer_interval', 'monthly');
        done();
      });
    })();
  });
});

