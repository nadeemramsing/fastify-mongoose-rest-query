const express = require('express')
const { config, restify, db } = require('mongoose-rest-query')
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoInit = require('../mongo-init');

config.modelSchemas = require('./model');
config.multiDB = true;

async function build() {

  const app = express()

  // Stub: MongoDB
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoInit(uri)

  app.mongod = mongod

  app.use((req, res, next) => { req.headers['x-client-mongodb-path'] = uri; next() })

  app.use(db)

  app.use('/express/api/employees', restify('Employee'))

  return app
}

module.exports = build