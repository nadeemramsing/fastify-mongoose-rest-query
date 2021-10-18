const plugin = require('fastify-plugin')

module.exports = modelName => plugin((app, opts, done) => {

  const handler = require('../handlers/main.param.handler')(modelName)

  const prefix = `${opts.prefix}/:id`

  app.get(prefix, handler.list)

  done()
})