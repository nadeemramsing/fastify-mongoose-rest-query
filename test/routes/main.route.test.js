const fp = {
  filter: require('lodash/fp/filter'),
  map: require('lodash/fp/map'),
  orderBy: require('lodash/fp/orderBy'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  pluck: require('lodash/fp/pluck'),
}

const build = require('../../app')
const employees = require('../../documents/employees')

let app

beforeAll(async () => app = await build())

afterAll(() => { app.mongod.stop(); app.close() })

test('Endpoint /employees GET with no querystring', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees'
  })

  body = JSON.parse(body)

  idsBody = fp.pluck('_id', body)
  idsEmployee = fp.pluck('_id', employees).map(String)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with 1 filter name=Nadeem', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?name=Nadeem'
  })

  body = JSON.parse(body)

  idsBody = fp.pluck('_id', body)

  idsEmployee = fp.pipe(
    fp.filter({ name: 'Nadeem' }),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with 2 filters name=~mira&age>=10', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?name=~mira&age>=10'
  })

  body = JSON.parse(body)

  idsBody = fp.pluck('_id', body)

  idsEmployee = fp.pipe(
    fp.filter(doc => RegExp('mira', 'i').test(doc.name) && doc.age >= 10),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with 1 filter addresses.street=street3', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?addresses.street=street3'
  })

  body = JSON.parse(body)

  idsBody = fp.pluck('_id', body)

  idsEmployee = fp.pipe(
    fp.filter(doc => doc.addresses.find(addr => addr.street === 'street3')),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with 1 filter noField=null', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?noField=null'
  })

  body = JSON.parse(body)

  idsBody = fp.pluck('_id', body)

  idsEmployee = fp.pipe(
    fp.filter(doc => !doc.noField),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with select name,age', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?select=name,age'
  })

  body = JSON.parse(body)

  const employeesPicked = fp.pipe(
    fp.map(fp.pick(['_id', 'name', 'age'])),
    fp.map(employee => ({ ...employee, '_id': employee._id.toString() }))
  )(employees)

  expect(body).toEqual(employeesPicked)
})

// test('Endpoint /employees GET with populate', async () => {

// })

test('Endpoint /employees GET with sort -name', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?sort=-name'
  })

  body = JSON.parse(body)

  idsBody = fp.pluck('_id', body)

  idsEmployee = fp.pipe(
    fp.orderBy('name', 'asc'),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

// test('Endpoint /employees GET with skip', async () => {

// })

// test('Endpoint /employees GET with limit', async () => {

// })