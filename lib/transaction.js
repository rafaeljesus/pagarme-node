'use strict';

var resource        = require('./resource')
  , extend          = require('lodash').extend
  , createCardHash  = require('./card_hash').create
  , assertPageCount = require('./assert_page_count').assert;

module.exports = resource.create('Transaction', {

  path: '/transactions',

  classMethods: {
    refund: function(id, cb) {
      var params = {
        path: this._options.path + '/' + id + '/refund',
        method: 'POST',
        query: { id: id }
      };
      this.pagarme.request(params, cb);
    },

    capture: function(id, options, cb) {
      var params = extend({
        path: this._options.path + '/' + id + '/capture',
        method: 'POST',
        query: { id: id }
      }, options);
      this.pagarme.request(params, cb);
    },

    calculateInstallments: function(options, cb) {
      var params = {
        path: this._options.path + '/calculate_installments_amount',
        method: 'GET',
        query: options
      };
      this.pagarme.request(params, cb);
    }
  }
})
.on('preCreate', createCardHash)
.on('preFind', assertPageCount);
