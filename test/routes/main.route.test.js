const fp = {
  filter: require('lodash/fp/filter'),
  map: require('lodash/fp/map'),
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

// test('Endpoint /employees GET with 1 filter address.street=street3', async () => {
//   let { body } = await app.inject({
//     method: 'GET',
//     url: '/api/employees?address.street=street3'
//   })

//   body = JSON.parse(body)

//   idsBody = fp.pluck('_id', body)
//   idsEmployee = fp.pluck('_id', employees)

//   expect(idsBody).toEqual(idsEmployee)
// })

// test('Endpoint /employees GET with select', async () => {
//   let { body } = await app.inject({
//     method: 'GET',
//     url: '/api/employees'
//   })

//   body = JSON.parse(body)

//   idsBody = fp.pluck('_id', body)
//   idsEmployee = fp.pluck('_id', employees)

//   expect(idsBody).toEqual(idsEmployee)
// })

// test('Endpoint /employees GET with populate', async () => {

// })

// test('Endpoint /employees GET with sort', async () => {

// })

// test('Endpoint /employees GET with skip', async () => {

// })

// test('Endpoint /employees GET with limit', async () => {

// })