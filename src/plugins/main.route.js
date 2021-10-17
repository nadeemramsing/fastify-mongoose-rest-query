const mainHandler = require('../handlers/main.handler')

module.exports = (app, opts, done) => {
  
  app.get(mainHandler)

  done()
}