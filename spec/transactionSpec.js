'use strict';

var expect        = require('chai').use(require('chai-as-promised')).expect
  , nock          = require('nock')
  , pagarme       = require('../')('ak_test_Rw4JR98FmYST2ngEHtMvVf5QJW7Eoo')
  , Transaction   = pagarme.Transaction;

describe('Transaction', function() {

  after(nock.cleanAll);

  it('should find transaction by hash', function() {
    var query = { customer: { document_number:  36433809847 }, page: 1, count: 10 };
    return Transaction.findBy(query).then(function(transactions) {
      Object
        .keys(transactions)
        .map(function(key) {
          expect(transactions[key].customer).to.have.property('document_number', '36433809847');
        });
    });
  });

});
