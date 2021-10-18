const mainHandler = require('../handlers/main.handler')

module.exports = schemas => (app, opts, done) => {

  for (const [modelName, { endpointName }] of Object.entries(schemas)) {
    app.get(`/${endpointName}`, mainHandler.list(modelName))

    app.log.info(`REST endpoints for ${modelName} model created`)
  }


  done()
}