async function main() {

  const app = await require('./app')({
    logger: {
      logLevel: 'info'
    }
  })

  app.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}

main()