const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
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

// test('Endpoint /employees/:id/addresses GET with no querystring', async () => {
//   let { body } = await app.inject({
//     method: 'GET',
//     url: '/api/employees/616d829d0767b556f1bc90c1/addresses'
//   })

//   body = JSON.parse(body)

//   debugger
// })

test('Endpoint /employees/:id/addresses GET with 1 filter city=~u', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees/616d829d0767b556f1bc90c1/addresses?city=~u&limit=1'
  })

  body = JSON.parse(body)

  debugger
})