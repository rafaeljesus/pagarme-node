## pagarme-node

[![Build Status](https://travis-ci.org/rafaeljesus/pagarme-node.svg)](https://travis-ci.org/rafaeljesus/pagarme-node) [![Code Climate](https://codeclimate.com/github/rafaeljesus/pagarme-node/badges/gpa.svg)](https://codeclimate.com/github/rafaeljesus/pagarme-node) [![Test Coverage](https://codeclimate.com/github/rafaeljesus/pagarme-node/badges/coverage.svg)](https://codeclimate.com/github/rafaeljesus/pagarme-node)


Pagar.me Node.js library

## Setup
```bash
$ npm install pagarme

```js
var pagarme = require('pagarme')('api_key');
// or
var Pagarme = require('pagarme').Pagarme;
var pagarme = new Pagarme({ key: 'api_key' });
```

## License
Pagar.me Node.js library is released under the [MIT License](http://www.opensource.org/licenses/MIT).
