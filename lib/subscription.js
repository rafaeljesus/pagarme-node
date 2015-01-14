'use strict';

var assertPageCount = require('./assert_page_count').assert
  , Promise         = require('bluebird')
  , _               = require('lodash')
  , resource        = require('./resource');

module.exports = resource.create('Subscription', {

  path: '/subscriptions',

  classMethods: {
    charge: Promise.method(function(options) {
      options = _.defaults(options, { installments: 1 });
      return this.pagarme.request(_.extend({
        path: this._options.path + '/' + options.id + '/transactions',
        method: 'POST',
        query: options
      }), options).bind(this);
    })
  }
})
.on('preFind', assertPageCount);
