const plugin = require('fastify-plugin')

const mainRoute = require('./plugins/main.route')
const assignModelsHook = require('./hooks/assignModels.hook')

module.exports = ({ prefix = '', schemas = {} }) => plugin((app, opts, done) => {

  app.addHook('onRequest', assignModelsHook({ app, schemas }));

  app.register(mainRoute(schemas), { prefix });

  done()
})