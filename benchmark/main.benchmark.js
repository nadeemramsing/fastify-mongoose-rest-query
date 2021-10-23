const autocannon = require('autocannon')

const { 'autocannon': config } = require('./config')
const { printResult } = require('./util')

const fastifyPrefix = 'http://localhost:3000/fastify'
const expressPrefix = 'http://localhost:3001/express'

module.exports = async () => {
  await benchmarkGet()
  await benchmarkGetWithQueryString()
  await benchmarkCount()
  await benchmarkPost()
  await benchmarkPut()
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

async function benchmarkCount() {
  const route = '/api/employees/count?' + [
    'name=~a$',
    'age>=10',
    'addresses.street=street2',
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
    method: 'POST',
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

async function benchmarkPut() {
  const route = '/api/employees?'

  console.log('Benchmarking ' + route + '... (PUT)')

  const requests = []
  for (let age = 1; age <= 100; age += 2)
    requests.push({
      body: JSON.stringify([
        {
          'id': '616d829d0767b556f1bc90c1',
          age
        },
        {
          'id': '616d829d0767b556f1bc90c1',
          'age': age + 1
        }
      ])
    })

  const fastifyResult = await autocannon({
    url: fastifyPrefix + route,
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    requests,
    ...config
  })

  const expressResult = await autocannon({
    url: expressPrefix + route,
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    requests,
    ...config
  })

  printResult(fastifyResult, expressResult)
}