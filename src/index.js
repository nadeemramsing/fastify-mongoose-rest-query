const mainRoute = require('./plugins/main.route')
const assignModelsHook = require('./hooks/assignModels.hook')

module.exports = ({ prefix = '', schemas = {} }) => (app, opts, done) => {

  app.addHook('onRequest', assignModelsHook({ app, schemas }));

  // req.models must be available
  app.register(mainRoute, { prefix });

  done()
}