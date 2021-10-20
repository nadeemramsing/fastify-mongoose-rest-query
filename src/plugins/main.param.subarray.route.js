const plugin = require('fastify-plugin')
const mainParamSubArrayParamRoute = require('./main.param.subarray.param.route')

module.exports = (modelName, schema) => plugin((app, opts, done) => {

  for (const [path, schemaInstance] of Object.entries(schema.obj)) {
    if (!Array.isArray(schemaInstance))
      continue

    const handler = require('../handlers/main.param.subarray.handler')(modelName, path)

    const prefix = `${opts.prefix}/${path}`

    app.get(prefix, handler.get)

    app.register(mainParamSubArrayParamRoute(modelName, path), { prefix })

  }

  done()
})