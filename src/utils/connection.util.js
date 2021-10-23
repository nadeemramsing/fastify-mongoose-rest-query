const { createConnection } = require('mongoose')
const { isEmpty } = require('./object.util')

module.exports = {
  getModels,
  closeConnections
}

const connMap = new Map()

function getConnection(uri) {
  let conn = connMap.get(uri)

  if (!conn) {
    conn = createConnection(uri)

    connMap.set(uri, conn)
  }

  return conn
}

function registerModels(conn, schemas) {
  for (const [modelName, { schema }] of Object.entries(schemas))
    model = conn.model(modelName, schema)
}

function getModels(uri, schemas) {
  const conn = getConnection(uri)

  if (isEmpty(conn.models))
    registerModels(conn, schemas)

  return conn.models
}

async function closeConnections() {
  for (const conn of connMap.values())
    await conn.close()
}