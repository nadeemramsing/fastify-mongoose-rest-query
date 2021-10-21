const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  map: require('lodash/fp/map'),
  orderBy: require('lodash/fp/orderBy'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  pluck: require('lodash/fp/pluck'),
  take: require('lodash/fp/take'),
  uniq: require('lodash/fp/uniq'),
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

  const idsBody = fp.pluck('id', body)
  const idsEmployee = fp.pluck('_id', employees).map(String)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with 1 filter name=Nadeem', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?name=Nadeem'
  })

  body = JSON.parse(body)

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
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

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
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

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
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

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
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
    fp.map(employee => {
      employee.id = employee._id.toString()
      delete employee._id

      employee.initial = employee.name[0].toUpperCase()

      return employee
    })
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

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
    fp.orderBy('name', 'asc'),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with skip 2', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?skip=2'
  })

  body = JSON.parse(body)

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
    fp.drop(2),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

test('Endpoint /employees GET with limit 2', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees?limit=2'
  })

  body = JSON.parse(body)

  const idsBody = fp.pluck('id', body)

  const idsEmployee = fp.pipe(
    fp.take(2),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idsBody).toEqual(idsEmployee)
})

// count

test('Endpoint /employees/distinct/:path GET without filter', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees/distinct/name'
  })

  body = JSON.parse(body)

  const namesEmployee = fp.pipe(
    fp.pluck('name'),
    fp.uniq
  )(employees)

  expect(body).toEqual(namesEmployee)
})

test('Endpoint /employees/distinct/:path GET with filter', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees/distinct/name?name=~a$'
  })

  body = JSON.parse(body)

  const namesEmployee = fp.pipe(
    fp.pluck('name'),
    fp.filter(doc => doc.endsWith('a')),
    fp.uniq
  )(employees)

  expect(body).toEqual(namesEmployee)
})

// create

test('Endpoint /employees PUT', async () => {
  let { body } = await app.inject({
    method: 'PUT',
    url: '/api/employees',
    payload: [
      {
        id: '616d829d0767b556f1bc90c1',
        age: 30
      },
      {
        id: '616d829d0767b556f1bc90c2',
        age: 26
      },
      {
        id: '616d829d0767b556f1bc90c3',
        age: 1
      }
    ]
  })

  body = JSON.parse(body)

  expect(body.length).toBe(3)

  expect(body.map(doc => [30, 26, 1].includes(doc.age)))
    .toEqual([true, true, true])
})

test('Endpoint /employees DELETE with filter name=~a$', async () => {
  let { body } = await app.inject({
    method: 'DELETE',
    url: '/api/employees?name=~a$'
  })

  expect(body).toBe('OK')
})

test('Endpoint /employees DELETE with filter name=~xxx$', async () => {
  let { body } = await app.inject({
    method: 'DELETE',
    url: '/api/employees?name=~xxx$'
  })

  expect(body).toBe('Document(s)NotFound')
})