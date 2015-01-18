/* jshint -W030 */

'use strict';

var expect      = require('chai').use(require('chai-as-promised')).expect
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , BankAccount = pagarme.BankAccount;

describe('BankAccount', function() {

  var bankAccountFixture;

  beforeEach(function() {
    bankAccountFixture = require('./fixtures/bank_account');
  });

  it('should create a bank account', function(done) {
    BankAccount
      .create(bankAccountFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should find by id', function(done) {
    BankAccount
      .create(bankAccountFixture)
      .then(function(obj) {
        return BankAccount.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should search by criteria', function(done) {
    var query = { bank_account: { agencia: 1935 }, page: 1, count: 10 };
    BankAccount
      .findBy(query)
      .then(function(accounts) {
        Object.keys(accounts).map(function(key) {
          expect(accounts[key]).to.have.property('agencia', '1935');
        });
        done();
      });
  });
});
