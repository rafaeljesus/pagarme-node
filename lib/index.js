'use strict'

const Pagarme = require('./pagarme')

module.exports = (key) => new Pagarme({key: key})

module.exports.Pagarme = Pagarme
