'use strict';

var assertPageCount = require('./assert_page_count').assert
  , resource  = require('./resource');

module.exports = resource.create('Subscription', {
  path: '/subscriptions'
})
.on('preFind', assertPageCount);
