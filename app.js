'use strict'

const fastify = require('fastify')

const mrq = require('./src')
const schemas = require('./schemas')

function build(opts = {}) {
  const app = fastify(opts)

  const mrqOptions = { prefix: '/api', schemas }

  app.decorateRequest('x-client-mongodb-path', '')
  app.addHook('onRequest', (req, rep, done) => req['x-client-mongodb-path'] = 'mongodb://localhost:test')

  app.register(mrq(mrqOptions))

  app.get('/', function (req, rep) {
    return { hello: 'world' }
  })

  return app
}

module.exports = build