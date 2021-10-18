const { getModels } = require('../utils/connection.util')

module.exports = ({ app, schemas }) => {
  app.decorateRequest('models', null)
  app.decorateRequest('collectionNames', null)

  return (req, rep, done) => {
    req.models = getModels(req['x-client-mongodb-path'], schemas)
    debugger
  }
}