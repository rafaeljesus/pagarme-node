/* jshint -W030 */

'use strict';

var chai         = require('chai').use(require('chai-as-promised'))
  , expect       = chai.expect
  , _            = require('lodash')
  , pagarme      = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Transaction  = pagarme.Transaction;

describe('Transaction', function() {

  var transactionFixture, customerFixture, metadataFixture;

  beforeEach(function() {
    transactionFixture = require('./fixtures/transaction');
    customerFixture = require('./fixtures/customer');
    metadataFixture = require('./fixtures/metadata');
  });

  it('should compose classMethods', function() {
    var classMethods = ['refund', 'capture', 'calculateInstallments'];
    classMethods.forEach(function(name) {
      expect(Transaction).itself.to.respondTo(name);
    });
  });

  it('should charge transaction', function(done) {
    Transaction
      .create(transactionFixture)
      .then(function(obj) {
        console.log('on spec');
        expect(obj.id).to.be.ok;
        expect(obj.card_holder_name).to.be.equal('Jose da Silva');
        expect(obj.date_created).to.be.ok;
        expect(obj.payment_method).to.be.equal('credit_card');
        expect(obj.status).to.be.equal('paid');
        done();
      });
  });

  it('should create transaction with customer', function(done) {
    var transactionWithCustomer = _.extend(transactionFixture, customerFixture);
    Transaction
      .create(transactionWithCustomer)
      .then(function(obj) {
        expect(obj.customer.id).to.be.ok;
        expect(obj.customer.document_type).to.be.equal('cpf');
        expect(obj.customer.name).to.be.equal('Jose da Silva');
        expect(obj.customer.born_at).to.be.ok;
        done();
      });
  });

  it('should create transaction with boleto', function(done) {
    Transaction
      .create({ payment_method: 'boleto', amount: 1000 })
      .then(function(obj) {
        expect(obj.payment_method).to.be.equal('boleto');
        expect(obj.status).to.be.equal('waiting_payment');
        expect(obj.amount).to.be.equal(1000);
        done();
      });
  });

  it('should refund transaction', function(done) {
    Transaction
      .create(transactionFixture)
      .then(function(obj) {
        return Transaction.refund(obj.id);
      })
      .then(function(obj) {
        expect(obj.status).to.be.equal('refunded');
        done();
      });
  });

  // FIXME Socket error when running after spec below
  it('should refund transaction with customer ', function(done) {
    var transactionWithCustomer = _.extend(transactionFixture, customerFixture);
    Transaction
      .create(transactionWithCustomer)
      .then(function(obj) {
        return Transaction.refund(obj.id);
      })
      .then(function(obj) {
        expect(obj.customer.id).to.be.ok;
        expect(obj.customer.document_type).to.be.equal('cpf');
        expect(obj.customer.name).to.be.equal('Jose da Silva');
        expect(obj.customer.born_at).to.be.ok;
        done();
      });
  });

  // FIXME Socket error when running after spec above
  it('should send metadata', function(done) {
    Transaction
      .create(_.extend(transactionFixture, metadataFixture))
      .then(function(obj) {
        expect(obj.metadata.event.id).to.be.equal(metadataFixture.metadata.event.id);
        done();
      });
  });

  // FIXME AssertionError: expected 'paid' to equal 'authorized'
  it('should capture a transaction and pass an amount', function(done) {
    Transaction
      .create(_.extend(transactionFixture, { capture: false }))
      .then(function(obj) {
        expect(obj.status).to.be.equal('authorized');
        return Transaction.capture(obj.id, { amount: 1000 });
      })
      .then(function(obj) {
        expect(obj.status).to.be.equal('paid');
        done();
      });
  });

  it('should search transaction by criteria', function(done) {
    var query = { customer: { document_number:  36433809847 }, page: 1, count: 10 };
    Transaction
      .findBy(query)
      .then(function(transactions) {
        Object.keys(transactions).map(function(key) {
          expect(transactions[key].customer).to.have.property('document_number', '36433809847');
        });
        done();
      });
  });

  it('should find transaction by id', function(done) {
    Transaction
      .create(transactionFixture)
      .then(function(obj) {
        return Transaction.findById(obj.id);
      })
      .then(function(obj) {
        expect(obj.id).to.be.ok;
        done();
      });
  });

  it('should calculate installments', function(done) {
    Transaction
      .calculateInstallments({ amount: transactionFixture.amount, interest_rate: 0 })
      .then(function(res) {
        expect([res.installments].length).to.be.equal(1);
        expect(res.installments[2].installment_amount).to.be.equal(500);
        done();
      });
  });

  describe('should validate', function(done) {
    // FIXME Internal Server Error 500
    it('card number', function(done) {
      transactionFixture.card_number = 123456;
      Transaction
        .create(transactionFixture)
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('card_number');
          done();
        });
    });

    it('card holder name', function(done) {
      delete transactionFixture.card_holder_name;
      Transaction
        .create(transactionFixture)
        .catch(function(err) {
          console.log(err);
          expect(err.type[0].parameter_name).to.be.equal('card_holder_name');
        });
    });

    it('card cvv', function(done) {
      delete transactionFixture.card_cvv;
      Transaction
        .create(transactionFixture)
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('card_cvv');
          done();
        });
    });

    it('card expiration date', function(done) {
      Transaction
        .create({ card_number: '4111111111111111', amount: '1000', card_holder_name: 'Jose da Silva', card_expiration_date: '10' })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('card_expiration_date');
        })
        .then(function() {
          return Transaction.create({ card_number: '4111111111111111', amount: '1000', card_holder_name: 'Jose da Silva', card_expiration_date: '12-1' });
        })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('card_expiration_date');
        })
        .then(function() {
          return Transaction.create({ card_number: '4111111111111111', amount: '1000', card_holder_name: 'Jose da Silva', card_expiration_date: '1216' });
        })
        .catch(function(err) {
          expect(err.type[0].parameter_name).to.be.equal('card_expiration_date');
          done();
        });
      });
  });

});
