const { getModels } = require('../utils/connection.util')

module.exports = ({ app, schemas }) => {
  app.decorateRequest('models', null)

  return (req, rep, done) => {
    
    req.models = getModels(req['x-client-mongodb-path'], schemas)

    done()
  }
}