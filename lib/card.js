'use strict';

var assertPageCount = require('./assert_page_count').assert
  , resource        = require('./resource');

module.exports = resource.create('Card', {
  path: '/cards'
})
.on('preFind', assertPageCount);
