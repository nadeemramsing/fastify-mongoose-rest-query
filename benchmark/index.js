const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoInit = require('../mongo-init')

async function main() {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoInit(uri)

  const fastifyApp = await require('../app')({ mongod, uri })
  const expressApp = await require('../mongoose-rest-query/app')({ mongod, uri })

  await fastifyApp.listen(3000, '0.0.0.0')
  console.log('Fastify server listening on ' + 3000)

  await expressListenAsync(expressApp, 3001)
  console.log('Express server listening on ' + 3001)

  await require('./main.benchmark')()
  await require('./main.param.benchmark')()
  await require('./main.param.subarray.benchmark')()
  await require('./main.param.subarray.param.benchmark')()

  process.exit(0)
}

main()

function expressListenAsync(app, port) {
  return new Promise(resolve => app.listen(port, resolve))
}