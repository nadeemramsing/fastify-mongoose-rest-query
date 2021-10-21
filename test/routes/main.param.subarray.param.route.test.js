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

test('Endpoint /employees/:id/addresses/:subId GET', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees/616d829d0767b556f1bc90c1/addresses/616d829d0767b556f1bc90c5'
  })

  body = JSON.parse(body)

  const { addresses } = fp.find({ _id: ObjectId('616d829d0767b556f1bc90c1') }, employees)
  const address = addresses.find(a => a._id.equals('616d829d0767b556f1bc90c5'))

  expect(body.id).toBe(address._id.toString())
})

test('Endpoint /employees/:id/addresses/:subId DELETE', async () => {
  let { body } = await app.inject({
    method: 'DELETE',
    url: '/api/employees/616d829d0767b556f1bc90c1/addresses/616d829d0767b556f1bc90c5'
  })

  expect(body).toBe('OK')

  let { 'body': body2 } = await app.inject({
    method: 'GET',
    url: '/api/employees/616d829d0767b556f1bc90c1/addresses/616d829d0767b556f1bc90c5'
  })

  expect(body2).toBe('SubDocumentNotFound')
})