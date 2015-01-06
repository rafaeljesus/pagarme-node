'use strict';

var assert    = require('assert')
  , assertPageCount = require('./assert_page_count').assert
  , resource  = require('./resource');

module.exports = resource.create('Plan', {
  path: '/plans'
})
.on('preFind', assertPageCount);
