const build = require('../../app')

let app

beforeAll(async () => app = await build())

afterAll(() => { app.mongod.stop(); app.close() })

test('requests the "/" route', async () => {
  const { statusCode } = await app.inject({
    method: 'GET',
    url: '/'
  })

  expect(statusCode).toBe(200)
})