'use strict';

var expect        = require('chai').use(require('chai-as-promised')).expect
  , nock          = require('nock')
  , _             = require('lodash')
  , pagarme       = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Transaction   = pagarme.Transaction;

describe('Transaction', function() {

  var transactionFixture, customerFixture, metadataFixture;

  before(function() {
    transactionFixture = require('./fixtures/transaction')
    customerFixture = require('./fixtures/customer')
    metadataFixture = require('./fixtures/metadata');
  });

  after(nock.cleanAll);

  it('should charge transaction', function() {
    Transaction
      .create(transactionFixture)
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        expect(obj.card_holder_name).to.be.equal('Jose da Silva');
        expect(obj.date_created).to.be.ok;
        expect(obj.payment_method).to.be.equal('credit_card');
        expect(obj.status).to.be.equal('paid');
      });
  });

  it('should create transaction with customer', function() {
    Transaction
      .create(_.extend(transactionFixture, customerFixture))
      .then(function(obj) {
        expect(obj.customer.id).to.be.ok;
        expect(obj.customer.document_type).to.be.equal('cpf');
        expect(obj.customer.name).to.be.equal('Jose da Silva');
        expect(obj.customer.born_at).to.be.ok;
      });
  });

  it('should create transaction with boleto', function() {
    Transaction
      .create({ payment_method: 'boleto', amount: 1000 })
      .then(function(obj) {
        expect(obj.payment_method).to.be.equal('boleto');
        expect(obj.status).to.be.equal('waiting_payment');
        expect(obj.amount).to.be.equal(1000);
      });
  });

  it('should refund transaction', function() {
    Transaction
      .create(transactionFixture)
      .then(function(obj) {
        return Transaction.refund(obj.id);
      })
      .then(function(obj) {
        expect(obj.status).to.be.equal('refunded');
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  it('should refund transaction with customer ', function() {
    Transaction
      .create(_.extend(transactionFixture, customerFixture))
      .then(function(obj) {
        return Transaction.refund(obj.id);
      })
      .then(function(obj) {
        expect(obj.customer.id).to.be.ok;
        expect(obj.customer.document_type).to.be.equal('cpf');
        expect(obj.customer.name).to.be.equal('Jose da Silva');
        expect(obj.customer.born_at).to.be.ok;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  it('should send metadata', function() {
    Transaction
      .create(_.extend(transactionFixture, metadataFixture))
      .then(function(obj) {
        expect(obj.metadata.event.id).to.be.equal(metadataFixture.metadata.event.id);
      });
  });

  it('should capture a transaction and pass an amount', function() {
    Transaction
      .create(_.extend(transactionFixture, { capture: false }))
      .then(function(obj) {
        expect(obj.status).to.be.equal('authorized');
        return Transaction.capture(obj.id, { amount: 1000 });
      })
      .then(function(obj) {
        expect(obj.status).to.be.equal('paid');
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  it('should validate invalid transaction', function() {

  });

  it('should find transaction by hash', function() {
    var query = { customer: { document_number:  36433809847 }, page: 1, count: 10 };
    Transaction
      .findBy(query)
      .then(function(transactions) {
        Object.keys(transactions).map(function(key) {
          expect(transactions[key].customer).to.have.property('document_number', '36433809847');
        });
      });
  });

  it('should find transaction by id', function() {
    Transaction
      .create(transactionFixture)
      .then(function(obj) {
        return Transaction.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj).to.be.ok;
      })
  });

  it('should calculate installments', function() {
    Transaction
      .calculateInstallments({ amount: transactionFixture.amount, interest_rate: 0 })
      .then(function(res) {
        expect([res.installments].length).to.be.equal(1);
        expect(res.installments[2].installment_amount).to.be.equal(500);
      });
  });

});
