'use strict';

var resource        = require('./resource')
  , _               = require('lodash')
  , assert          = require('assert')
  , Promise         = require('bluebird')
  , createCardHash  = require('./card_hash').create
  , assertPageCount = require('./assert_page_count').assert
  , ursa            = require('ursa');

module.exports = resource.create('Transaction', {
  path: '/transactions',
  classMethods: {
    refund: Promise.method(function(id) {
      return this.pagarme.request({
        path: this._options.path + '/' + id + '/refund',
        method: 'POST',
        query: { id: id }
      })
      .bind(this)
      .then(function(data) {
        return new this(data);
      });
    }),

    capture: Promise.method(function(id, options) {
      return this.pagarme.request(_.extend({
        path: this._options.path + '/' + id + '/capture',
        method: 'POST',
        query: { id: id }
      }), options)
      .bind(this)
      .then(function(data) {
        return new this(data);
      });
    }),

    calculateInstallments: Promise.method(function(options) {
      return this.pagarme.request({
        path: this._options.path + '/calculate_installments_amount',
        method: 'GET',
        query: options
      })
      .bind(this)
      .then(function(data) {
        return new this(data);
      });
    })
  }
})
.on('preCreate', createCardHash)
.on('preFind', assertPageCount);
