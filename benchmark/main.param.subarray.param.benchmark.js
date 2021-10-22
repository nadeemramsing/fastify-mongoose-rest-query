const autocannon = require('autocannon')

const { 'autocannon': config } = require('./config')
const { printResult } = require('./util')

module.exports = async () => {
  await benchmarkGet()

  process.exit(0)
}

async function benchmarkGet() {
  const fastifyPrefix = 'http://localhost:3000/fastify'
  const expressPrefix = 'http://localhost:3001/express'
  const route = '/api/employees/616d829d0767b556f1bc90c1/addresses/616d829d0767b556f1bc90c5'

  console.log('Benchmarking ' + route + '...')

  const fastifyResult = await autocannon({
    url: fastifyPrefix + route,
    method: 'GET',
    ...config
  })

  const expressResult = await autocannon({
    url: expressPrefix + route,
    method: 'GET',
    ...config
  })

  printResult(fastifyResult, expressResult)
}