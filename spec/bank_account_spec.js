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
      });
  });

  it('should update a bank account', function() {
    var legalName = 'Rafael Jesus'
    BankAccount
      .create(bankAccountFixture)
      .then(function(obj) {
        return BankAccount.update(obj.id, { legal_name: legalName });
      })
      .then(function(obj) {
        expect(obj.legal_name).to.be.equal(legalName);
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

  it('should search by criteria', function() {
    var query = { bank_account: { agencia: 1935 }, page: 1, count: 10 };
    BankAccount
      .findBy(query)
      .then(function(accounts) {
        Object.keys(accounts).map(function(key) {
          expect(accounts[key]).to.have.property('agencia', '1935');
        });
      });
  });
});
