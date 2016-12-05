'use strict'

const assert = require('assert')

exports.assert = (options) => {
  assert(!(options.page < 1 || options.count < 1), 'Invalid Page Count')
}
