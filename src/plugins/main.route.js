module.exports = schemas => (app, opts, done) => {

  for (const [modelName, { endpointName }] of Object.entries(schemas)) {
    
    const mainHandler = require('../handlers/main.handler')(modelName)

    app.get(`/${endpointName}`, mainHandler.list)

    app.get(`/${endpointName}/count`, mainHandler.count)

    app.log.info(`REST endpoints for ${modelName} model created`)
  }

  done()
}