const fastify = require('fastify')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mrq = require('./src')
const schemas = require('./models')
const mongoInit = require('./mongo-init')

async function build(opts = {}) {
  const app = fastify(opts)

  // Stub: MongoDB
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoInit(uri)

  const mrqOptions = { prefix: '/api', schemas }

  // Stub: Hook for x-client-mongodb-path
  app.decorateRequest('x-client-mongodb-path', '')
  app.addHook('onRequest', async req => req['x-client-mongodb-path'] = uri)

  app.register(mrq(mrqOptions))

  return app
}

module.exports = build