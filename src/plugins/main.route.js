const plugin = require('fastify-plugin')

const mainParamRoute = require('./main.param.route')

module.exports = schemas => plugin((app, opts, done) => {

  for (const [modelName, { endpointName, schema }] of Object.entries(schemas)) {

    const handler = require('../handlers/main.handler')(modelName)

    const prefix = `${opts.prefix}/${endpointName}`

    app.get(prefix, handler.get)

    app.get(`${prefix}/count`, handler.count)

    app.get(`${prefix}/distinct/:path`, handler.distinct)

    app.post(`${prefix}`, handler.create)

    app.put(`${prefix}`, handler.updateMany)

    app.delete(`${prefix}`, handler.deleteMany)

    app.register(mainParamRoute(modelName, schema), { prefix })
  }

  done()
})