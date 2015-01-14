'use strict';

var chai              = require('chai').use(require('chai-as-promised'))
  , expect            = chai.expect
  , pagarme_resource  = require('../lib/pagarme_resource');

describe('PagarmeResource', function() {

  it('should expose base promisses', function() {
    var methods = ['findBy', 'findById', 'create', 'update'];
    methods.forEach(function(method) {
      expect(pagarme_resource).itself.to.respondTo(method);
    });
  });
});
