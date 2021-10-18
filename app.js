'use strict'

const fastify = require('fastify')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mrq = require('./src')
const schemas = require('./models')

async function build(opts = {}) {
  const app = fastify(opts)

  // Stub: MongoDB
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  const mrqOptions = { prefix: '/api', schemas }

  // Stub: Hook for x-client-mongodb-path
  app.decorateRequest('x-client-mongodb-path', '')
  app.addHook('onRequest', async req => req['x-client-mongodb-path'] = uri)

  app.register(mrq(mrqOptions))

  app.get('/', function (req, rep) {
    return { hello: 'world' }
  })

  return app
}

module.exports = build