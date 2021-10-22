const express = require('express')
const morgan = require('morgan')

const { config, restify, db } = require('mongoose-rest-query')
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoInit = require('../mongo-init');

config.modelSchemas = require('./model');
config.multiDB = true;

async function build({ mongod, uri } = {}) {

  const app = express()

  // Stub: MongoDB
  if (!mongod) {
    mongod = await MongoMemoryServer.create()
    uri = mongod.getUri()
    await mongoInit(uri)
  }

  app.mongod = mongod

  app.use(morgan('common'))

  app.use((req, res, next) => { req.headers['x-client-mongodb-path'] = uri; next() })

  app.use(db)

  app.use('/express/api/employees', restify('Employee'))

  return app
}

module.exports = build