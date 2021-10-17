const { createConnection } = require('mongoose')

module.exports = {
  getConnection
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