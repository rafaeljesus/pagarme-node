'use strict';

var assert          = require('assert')
  , assertPageCount = require('./assert_page_count').assert
  , resource        = require('./resource');

module.exports = resource.create('Card', {
  path: '/cards'
})
.on('preFind', assertPageCount);
