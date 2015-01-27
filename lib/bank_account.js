'use strict';

var resource        = require('./resource')
  , assertPageCount = require('./assert_page_count').assert

module.exports = resource.create('BankAccount', {
  path: '/bank_accounts',
  beforeFind: assertPageCount,
});
