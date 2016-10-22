
var util = require('util')
var Strategy = require('anvil-connect/node_modules/passport-strategy')
var User = require('anvil-connect/models/User')

function SingleIdentifierStrategy (provider, client, verify) {
  Strategy.call(this)
  this.provider = provider
  this.endpoints = provider.endpoints
  this.mapping = provider.mapping
  this.client = client
  this.name = provider.id
  this.verify = verify
}

util.inherits(SingleIdentifierStrategy, Strategy)

function verifier (req, identifier, done) {
  User.lookup(req, { id: identifier }, done)
}

SingleIdentifierStrategy.verifier = verifier

function initialize (provider, configuration) {
  return new SingleIdentifierStrategy(provider, configuration, verifier)
}

SingleIdentifierStrategy.initialize = initialize

function authenticate (req, options) {
  options = options || {}
  var strategy = this
  var identifier = req.query && req.query.identifier

  if (!identifier) {
    return this.fail({ message: options.badRequestMessage || 'invalid identifier' }, 400)
  } else {
    strategy.verify(req, identifier, function (err, user, info) {
      if (err) { return strategy.error(err) }
      if (!user) { return strategy.fail(info) }
      strategy.success(user, info)
    })
  }

}

SingleIdentifierStrategy.prototype.authenticate = authenticate

/**
 * Exports
 */

module.exports = SingleIdentifierStrategy
