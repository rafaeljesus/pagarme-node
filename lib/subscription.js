'use strict';

var assertPageCount = require('./assert_page_count').assert
  , _               = require('lodash')
  , resource        = require('./resource');

module.exports = resource.create('Subscription', {

  path: '/subscriptions',

  classMethods: {
    charge: function(options, cb) {
      options = _.defaults(options, { installments: 1 });
      var params = _.extend({
        path: this._options.path + '/' + options.id + '/transactions',
        method: 'POST',
        query: options
      }, options);
      return this.pagarme.request(params, cb);
    }
  }
})
.on('preFind', assertPageCount);
