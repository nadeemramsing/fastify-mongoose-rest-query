const { createConnection } = require('mongoose')

module.exports = {
  getConnection,
  getModels
}

const connMap = new Map()

function getConnection(uri) {
  let conn = connMap.get(uri)

  if (!conn) {
    const instance = createConnection(uri)

    conn = { instance, 'modelMap': new Map() }

    connMap.set(uri, conn)
  }

  return conn
}

function getModels(uri, schemas) {
  const conn = getConnection(uri)

  for (const [modelName, { schema }] of Object.entries(schemas)) {
    let model = conn.modelMap.get(modelName)

    if (!model) {
      model = conn.instance.model(modelName, schema)

      conn.modelMap.set(modelName, model)
    }
  }

  return conn.modelMap
}