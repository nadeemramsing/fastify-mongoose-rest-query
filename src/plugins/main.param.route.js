const plugin = require('fastify-plugin')

const mainParamSubarrayRoute = require('../plugins/main.param.subarray.route')

module.exports = (modelName, schema) => plugin((app, opts, done) => {

  const handler = require('../handlers/main.param.handler')(modelName)

  const prefix = `${opts.prefix}/:id`

  app.get(prefix, handler.getById)

  app.put(prefix, handler.updateById)

  app.delete(prefix, handler.deleteById)

  app.register(mainParamSubarrayRoute(modelName, schema), { prefix })

  done()
})