async function main() {

  const app = await require('./app')({
    logger: {
      logLevel: 'info'
    }
  })

  await app.ready()

  app.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}

module.exports = main