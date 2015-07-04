'use strict';

var resource        = require('./resource')
  , extend          = require('lodash').extend
  , assertPageCount = require('./assert_page_count').assert
  , createCardHash  = require('./card_hash').create;

module.exports = resource.create('Transaction', {

  path: '/transactions',
  beforeCreate: createCardHash,
  beforeFind: assertPageCount,

  classMethods: {
    refund: function(id, cb) {
      var params = {
        path: this._options.path + '/' + id + '/refund',
        method: 'POST',
        query: {id: id}
      };
      return this.pagarme.request(params, cb);
    },

    capture: function(id, options, cb) {
      var params = extend({
        path: this._options.path + '/' + id + '/capture',
        method: 'POST',
        query: {id: id}
      }, options);
      return this.pagarme.request(params, cb);
    },

    calculateInstallments: function(options, cb) {
      var params = {
        path: this._options.path + '/calculate_installments_amount',
        method: 'GET',
        query: options
      };
      return this.pagarme.request(params, cb);
    }
  }
});
