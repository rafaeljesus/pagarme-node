'use strict';

var expect      = require('chai').use(require('chai-as-promised')).expect
  , nock        = require('nock')
  , pagarme     = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , BankAccount = pagarme.BankAccount;

describe('BankAccount', function() {

  var bankAccountFixture;

  before(function() {
    bankAccountFixture = require('./fixtures/bank_account');
  });

  after(nock.cleanAll);

  it('should create a bank account', function() {
    BankAccount
      .create(bankAccountFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  it('should find by id', function() {
    BankAccount
      .create(bankAccountFixture)
      .then(function(obj) {
        return BankAccount.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
      });
  });
});
