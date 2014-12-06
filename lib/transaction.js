'use strict';

var resource = require('./resource');

var Transaction = resource.create('Transaction', {
  path: '/transactions'
});

module.exports = Transaction;
