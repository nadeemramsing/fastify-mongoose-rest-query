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

test('Endpoint /employees/:id GET with no querystring', async () => {
  let { body } = await app.inject({
    method: 'GET',
    url: '/api/employees/616d829d0767b556f1bc90c1'
  })

  body = JSON.parse(body)

  const idBody = body._id

  const [idEmployee] = fp.pipe(
    fp.filter(doc => doc._id.equals('616d829d0767b556f1bc90c1')),
    fp.pluck('_id'),
    fp.map(String)
  )(employees)

  expect(idBody).toEqual(idEmployee)
})