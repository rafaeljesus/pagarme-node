'use strict';

var assertPageCount = require('./assert_page_count').assert
  , resource        = require('./resource');

module.exports = resource.create('BankAccount', {
  path: '/bank_accounts'
})
.on('preFind', assertPageCount);
