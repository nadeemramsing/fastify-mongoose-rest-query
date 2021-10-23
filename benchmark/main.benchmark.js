const autocannon = require('autocannon')

const { 'autocannon': config } = require('./config')
const { printResult } = require('./util')

const fastifyPrefix = 'http://localhost:3000/fastify'
const expressPrefix = 'http://localhost:3001/express'

module.exports = async () => {
  await benchmarkGet()
  await benchmarkGetWithQueryString()
  await benchmarkPost()
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

async function benchmarkPost() {
  const route = '/api/employees'

  console.log('Benchmarking ' + route + '... (POST)')

  const body = JSON.stringify({
    name: 'TestName',
    age: 10,
    addresses: [
      {
        street: 'TestStreet1',
        city: 'TestCity1'
      },
      {
        street: 'TestStreet2',
        city: 'TestCity2'
      }
    ]
  })

  const fastifyResult = await autocannon({
    url: fastifyPrefix + route,
    headers: { 'content-type': 'application/json' },
    body,
    ...config
  })

  const expressResult = await autocannon({
    url: expressPrefix + route,
    method: 'POST',
    body,
    ...config
  })

  printResult(fastifyResult, expressResult)
}