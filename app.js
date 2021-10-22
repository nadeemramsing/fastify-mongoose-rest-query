const fastify = require('fastify')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mrq = require('./src')
const schemas = require('./models')
const mongoInit = require('./mongo-init')

async function build({ mongod, uri } = {}) {
  const app = fastify({
    logger: {
      logLevel: 'info'
    }
  })

  // Stub: MongoDB
  if (!mongod) {
    mongod = await MongoMemoryServer.create()
    uri = mongod.getUri()
    await mongoInit(uri)
  }

  app.mongod = mongod

  const mrqOptions = { prefix: '/fastify/api', schemas }

  // Stub: Hook for x-client-mongodb-path
  app.decorateRequest('x-client-mongodb-path', '')
  app.addHook('onRequest', async req => req['x-client-mongodb-path'] = uri)

  app.register(mrq(mrqOptions))

  return app
}

module.exports = build