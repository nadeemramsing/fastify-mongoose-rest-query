const plugin = require('fastify-plugin')

module.exports = (modelName, path) => plugin((app, opts, done) => {

  const handler = require('../handlers/main.param.subarray.param.handler')(modelName, path)

  const prefix = `${opts.prefix}/:subId`

  app.get(prefix, handler.getById)

  done()
})