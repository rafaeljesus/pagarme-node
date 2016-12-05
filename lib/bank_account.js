'use strict'

const resource = require('./resource')
const assertPageCount = require('./assert_page_count').assert

module.exports = resource.create('BankAccount', {
  path: '/bank_accounts',
  beforeFind: assertPageCount,
})
