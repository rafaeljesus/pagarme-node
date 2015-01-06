'use strict';

var assert = require('assert');

exports.assert = function(options) {
  assert(!(options.page < 1 || options.count < 1), 'Invalid Page Count');
};
