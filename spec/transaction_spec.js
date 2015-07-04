/* jshint -W030 */

'use strict';

var async        = require('async')
  , expect       = require('chai').expect
  , extend       = require('lodash').extend
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
    Transaction.create(transactionFixture, function(err, res) {
      expect(res.id).to.be.ok;
      expect(res.card_holder_name).to.be.equal('Jose da Silva');
      expect(res.date_created).to.be.ok;
      expect(res.payment_method).to.be.equal('credit_card');
      expect(res.status).to.be.equal('paid');
      done();
    });
  });

  it('should create transaction with customer', function(done) {
    var transactionWithCustomer = extend(transactionFixture, customerFixture);
    Transaction.create(transactionWithCustomer, function(err, res) {
      expect(res.customer.id).to.be.ok;
      expect(res.customer.document_type).to.be.equal('cpf');
      expect(res.customer.name).to.be.equal('Jose da Silva');
      expect(res.customer.born_at).to.be.ok;
      done();
    });
  });

  it('should create transaction with boleto', function(done) {
    var options = { payment_method: 'boleto', amount: 1000 };
    Transaction.create(options, function(err, res) {
      expect(res.id).to.be.ok;
      expect(res.payment_method).to.be.equal('boleto');
      expect(res.status).to.be.equal('waiting_payment');
      expect(res.amount).to.be.equal(1000);
      done();
    });
  });

  it('should refund transaction', function(done) {
    async.seq(function(next) {
      Transaction.create(transactionFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      Transaction.refund(res.id, function(err, res) {
        if (err) return done(err);
        expect(res.status).to.be.equal('refunded');
        done();
      });
    })();
  });

  it('should refund transaction with customer ', function(done) {
    async.seq(function(next) {
      var withCustomer = extend(transactionFixture, customerFixture);
      Transaction.create(withCustomer, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      Transaction.refund(res.id, function(err, res) {
        expect(res.customer.id).to.be.ok;
        expect(res.customer.document_type).to.be.equal('cpf');
        expect(res.customer.name).to.be.equal('Jose da Silva');
        expect(res.customer.born_at).to.be.ok;
        done();
      });
    })();
  });

  it('should send metadata', function(done) {
    var withMetada = extend(transactionFixture, metadataFixture);
    Transaction.create(withMetada, function(err, res) {
      expect(err).to.be.null;
      expect(res.metadata.event.id).to.be.equal(metadataFixture.metadata.event.id);
      done();
    });
  });

  /* FIXME expected 'paid' to equal 'authorized' */
  /*it('should capture a transaction and pass an amount', function(done) {
    async.seq(function(next) {
      var options = extend(transactionFixture, { capture: false });
      Transaction.create(options, function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal('authorized');
        next(null, res);
      });
    }, function(res) {
      Transaction.capture(res.id, { amount: 1000 }, function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal('paid');
        done();
      });
    })();
  });*/

  it('should search transaction by criteria', function(done) {
    var query = {
      customer: {
        document_number: 36433809847
      },
      page: 1,
      count: 10
    };
    Transaction.findBy(query, function(err, res) {
      Object.keys(res).map(function(key) {
        expect(res[key].customer).to.have.property('document_number', '36433809847');
      });
      done();
    });
  });

  it('should find transaction by id', function(done) {
    async.seq(function(next) {
      Transaction.create(transactionFixture, function(err, res) {
        expect(err).to.be.null;
        next(null, res);
      });
    }, function(res) {
      Transaction.findById(res.id, function(err, res) {
        expect(err).to.be.null;
        expect(res.id).to.be.ok;
        done();
      });
    })();
  });

  it('should calculate installments', function(done) {
    var options = {amount: transactionFixture.amount, interest_rate: 0};
    Transaction.calculateInstallments(options, function(err, res) {
      expect([res.installments].length).to.be.equal(1);
      expect(res.installments[2].installment_amount).to.be.equal(500);
      done();
    });
  });

  describe('should validate', function(done) {
    /* FIXME throws internal server 500 */
    /*it('card number', function(done) {
      transactionFixture.card_number = 123456;
      Transaction.create(transactionFixture, function(err, res) {
        console.log(err);
        expect(err.type[0].parameter_name).to.be.equal('card_number');
        done();
      });
    });

    it('card holder name', function(done) {
      delete transactionFixture.card_holder_name;
      Transaction.create(transactionFixture, function(err, res) {
        console.log(err);
        expect(err.type[0].parameter_name).to.be.equal('card_holder_name');
      });
    });

    it('card cvv', function(done) {
      delete transactionFixture.card_cvv;
      Transaction.create(transactionFixture, function(err, res) {
        console.log(err);
        expect(err.type[0].parameter_name).to.be.equal('card_cvv');
        done();
      });
    });*/

    it('card expiration date', function(done) {
      async.series([function(next) {
        var options = {
          card_number: '4111111111111111',
          amount: '1000',
          card_holder_name: 'Jose da Silva',
          card_expiration_date: '10'
        };
        Transaction.create(options, function(err, res) {
          expect(err.type[0].parameter_name).to.be.equal('card_expiration_date');
          next();
        });
      }, function(next) {
        var options = {
          card_number: '4111111111111111',
          amount: '1000',
          card_holder_name: 'Jose da Silva',
          card_expiration_date: '12-1'
        };
        Transaction.create(options, function(err, res) {
          expect(err.type[0].parameter_name).to.be.equal('card_expiration_date');
          next();
        });
      }, function(next) {
        var options = {
          card_number: '4111111111111111',
          amount: '1000',
          card_holder_name: 'Jose da Silva',
          card_expiration_date: '1216'
        };
        Transaction.create(options, function(err, res) {
          expect(err.type[0].parameter_name).to.be.equal('card_cvv');
          next();
        });
      }],
      function() {
        done();
      });
    });
  });

});
