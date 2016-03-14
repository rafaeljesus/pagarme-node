'use strict';

var resource        = require('./resource')
  , assertPageCount = require('./assert_page_count').assert;

module.exports = resource.create('Recipient', {
  path: '/recipients',
  beforeFind: assertPageCount,

  classMethods: {
    balance: function (id, cb) {
      var params = {
        path: this._options.path + '/' + id + '/balance',
        method: 'GET',
        query: {id: id}
      };

      return this.pagarme.request(params, cb);
    }
  }
});

