const plugin = require('fastify-plugin')

const mainRoute = require('./plugins/main.route')
const assignModelsHook = require('./hooks/assignModels.hook');
const { closeConnections } = require('./utils/connection.util');

module.exports = ({ prefix = '', schemas = {} }) => plugin((app, opts, done) => {

  app.addHook('onRequest', assignModelsHook({ app, schemas }));

  app.addHook('onRoute', ({ url, method }) => app.log.info(`Endpoint created: ${url} ${method}`))

  app.addHook('onClose', closeConnections)

  app.register(mainRoute(schemas), { prefix })

  done()
})