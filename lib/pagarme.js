'use strict'

const assert = require('assert')
const util = require('util')
const _ = require('lodash')
const needle = require('needle')
const crypto = require('crypto')

module.exports = Pagarme

function Pagarme (config = {}) {
  assert(this instanceof Pagarme, 'Pagarme must be called with new')
  assert(!!config.key, 'You need to configure a API key before performing requests.')

  this.key = config.key
  this.endpoint = 'https://api.pagar.me/%s'
  this.Card = require('./card')(this)
  this.BankAccount = require('./bank_account')(this)
  this.Plan = require('./plan')(this)
  this.Subscription = require('./subscription')(this)
  this.Transaction = require('./transaction')(this)
  this.Recipient = require('./recipient')(this)
}

Pagarme.prototype.base = function (options) {
  options = _.defaults(options, {version: '1'})
  return util.format.apply(util, [this.endpoint, options.version])
}

Pagarme.prototype.url = function (options) {
  _.defaults(options, {path: ''})
  return this.base(options) + options.path
}

Pagarme.prototype.request = function (options, cb) {
  options = _.defaults(options, {
    method: 'GET',
    query: {}
  })

  const requestParams = generateQuery({api_key: this.key}, options.query)

  return needle.request(
    options.method,
    this.url(options),
    requestParams,
    {json: true, timeout: 8000}, (err, res) => {
      if (res.statusCode === 200) return cb(null, res.body)
      const error = {
        type: res.body.errors || 'unknown',
        body: res.body,
        statusCode: res.statusCode
      }
      return cb(error)
    })
}

Pagarme.prototype.validateFingerprint = function (id, fingerprint) {
  const hash = id + '#' + crypto.createHash('sha1').digest('hex') + this.key
  return hash === fingerprint
}

function generateQuery () {
  const query = _.omit(_.extend.apply(_, [{}].concat([].slice.apply(arguments))), _.isUndefined)
  return _.isEmpty(query) ? undefined : query
}
