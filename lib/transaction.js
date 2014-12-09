'use strict';

var resource = require('./resource')
  , CardHash = require('./card_hash');

function beforeCreate(options, create) {
  options.payment_type = options.payment_type || 'credit_card';
  options.installments = options.installments || 1;
  options.status = options.status || 'local';
  CardHash.generate(this.pagarme, options).then(function(cardHash) {
  // FIXME this callback is not being invoked
    options.card_hash = cardHash;
    clearCardData(options);
    return create(options);
  });
}

function clearCardData(options) {
  delete options.card_number;
  delete options.card_holder_name;
  delete options.card_expiration_year;
  delete options.card_expiration_month;
  delete options.card_cvv;
}

var Transaction = resource.create('Transaction', {
  path: '/transactions'
})
.on('beforeCreate', beforeCreate);

module.exports = Transaction;
