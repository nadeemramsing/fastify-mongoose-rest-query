const autocannon = require('autocannon')

const { 'autocannon': config } = require('./config')
const { printResult } = require('./util')

const fastifyPrefix = 'http://localhost:3000/fastify'
const expressPrefix = 'http://localhost:3001/express'

module.exports = async () => {
  await benchmarkGet()
  await benchmarkGetWithQueryString()
}

async function benchmarkGet() {
  const route = '/api/employees'

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

async function benchmarkGetWithQueryString() {
  const route = '/api/employees?' + [
    'name=~a$',
    'age>=10',
    'addresses.street=street2',
    'select=name,age',
    'sort=-name',
    'limit=1'
  ].join('&')

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