/* jshint -W030 */

'use strict';

var async       = require('async')
  , expect      = require('chai').expect
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , BankAccount = pagarme.BankAccount;

describe('BankAccount', function() {

  var bankAccountFixture;

  beforeEach(function() {
    bankAccountFixture = require('./fixtures/bank_account');
  });

  it('should create a bank account', function(done) {
    BankAccount.create(bankAccountFixture, function(err, res) {
      expect(res.id).to.be.ok;
      done();
    });
  });

  it('should find by id', function(done) {
    async.seq(function(next) {
      BankAccount.create(bankAccountFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      BankAccount.findById(res.id, function(err, res) {
        expect(res.id).to.be.ok;
        done();
      });
    })();
  });

  it('should search by criteria', function(done) {
    var query = { bank_account: { agencia: 1935 }, page: 1, count: 10 };
    BankAccount.findBy(query, function(err, accounts) {
      Object.keys(accounts).map(function(key) {
        expect(accounts[key]).to.have.property('agencia', '1935');
      });
      done();
    });
  });
});
