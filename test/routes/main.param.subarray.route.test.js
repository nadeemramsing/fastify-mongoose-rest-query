const { Types: { ObjectId } } = require('mongoose')

const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  find: require('lodash/fp/find'),
  map: require('lodash/fp/map'),
  orderBy: require('lodash/fp/orderBy'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  pluck: require('lodash/fp/pluck'),
  take: require('lodash/fp/take'),
}

const build = require('../../app')
const employees = require('../../documents/employees')

let app

beforeAll(async () => app = await build())

afterAll(() => { app.mongod.stop(); app.close() })

test('Endpoint /employees/:id/addresses GET with no querystring', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses'
  })

  body = JSON.parse(body)

  expect(Array.isArray(body)).toBe(true)
})

test('Endpoint /employees/:id/addresses GET with 1 filter city=~sin$', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses?city=~sin$'
  })

  body = JSON.parse(body)

  const idBody = body[0].id

  const { addresses } = fp.find({ _id: ObjectId('616d829d0767b556f1bc90c1') }, employees)
  const address = addresses.find(a => RegExp('sin$', 'i').test(a.city))

  expect(idBody).toBe(address._id.toString())
})

test('Endpoint /employees/:id/addresses/distinct/city GET', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses/distinct/city'
  })

  body = JSON.parse(body)

  expect(body).toEqual(['Beau Bassin', 'Curepipe'])
})

test('Endpoint /employees/:id/addresses/distinct/city GET with filter', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses/distinct/city?city=~pipe$'
  })

  body = JSON.parse(body)

  expect(body).toEqual(['Curepipe'])
})

test('Endpoint /employees/:id/addresses/distinct GET', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses/distinct'
  })

  body = JSON.parse(body)

  expect(Array.isArray(body)).toBe(true)
})

test('Endpoint /employees/:id/addresses POST with object', async () => {
  const payload = {
    street: 'TestStreet',
    city: 'TestCity'
  }

  let { body } = await app.inject({
    method: 'POST',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses',
    payload
  })

  body = JSON.parse(body)

  expect(body).toMatchObject(payload)
})

test('Endpoint /employees/:id/addresses POST with array', async () => {
  const payload1 = {
    street: 'TestStreet1',
    city: 'TestCity1'
  }

  const payload2 = {
    street: 'TestStreet2',
    city: 'TestCity2'
  }

  let { body } = await app.inject({
    method: 'POST',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses',
    payload: [payload1, payload2]
  })

  body = JSON.parse(body)

  const [address1, address2] = body.slice(-2)

  expect(address1).toMatchObject(payload1)
  expect(address2).toMatchObject(payload2)
})

test('Endpoint /employees/:id/addresses PUT with array', async () => {
  const payload1 = {
    id: '616d829d0767b556f1bc90c4',
    street: 'TestStreet1',
    city: 'TestCity1'
  }

  const payload2 = {
    id: '616d829d0767b556f1bc90c5',
    street: 'TestStreet2',
    city: 'TestCity2'
  }

  let { body } = await app.inject({
    method: 'PUT',
    url: '/fastify/api/employees/616d829d0767b556f1bc90c1/addresses',
    payload: [payload1, payload2]
  })

  body = JSON.parse(body)

  // expect(body[body.length - 1]).toMatchObject(payload)
})