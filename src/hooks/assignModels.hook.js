const connectionUtil = require('../utils/connection.util')

module.exports = ({ app, schemas }) => {
  app.decorateRequest('models', null)

  return (req, rep, done) => {
    // req['x-client-mongodb-path'] available here

    const conn = connectionUtil.getConnection(req['x-client-mongodb-path'])

    for (const [modelName, schema] in Object.entries(schemas)) {
      debugger

      const models = conn.model(modelName, schema)

      // get collectionName from model here
      debugger
    }
  }
}