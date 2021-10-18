const plugin = require('fastify-plugin')

const mainRoute = require('./plugins/main.route')
const assignModelsHook = require('./hooks/assignModels.hook')

module.exports = ({ prefix = '', schemas = {} }) => plugin(async (app, opts, done) => {

  app.addHook('onRequest', assignModelsHook({ app, schemas }));

  app.addHook('onRoute', ({ url, method }) => app.log.info(`Route created: ${method} ${url}`))

  app.register(mainRoute(schemas), { prefix });
})