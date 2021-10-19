const fp = {
  pluck: require('lodash/fp/pluck')
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

  idsBody = fp.pluck('id', body)
  idsEmployee = fp.pluck('id', employees)

  expect(idsBody).toEqual(idsEmployee)
})