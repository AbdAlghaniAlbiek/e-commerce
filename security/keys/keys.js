/* eslint-disable no-undef */
const devKeys = require('./dev_keys')
const prodKeys = require('./Prod_keys')

if (process.env.NODE_ENV === 'Production') {
	module.exports = prodKeys
}

module.exports = devKeys
