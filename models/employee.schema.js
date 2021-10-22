const { Schema } = require('mongoose');
const leanVirtuals = require('mongoose-lean-virtuals')
const sanitizeJson = require('mongoose-sanitize-json')

module.exports = (options = {}) => {

  const addressSchema = new Schema({
    street: String,
    city: String
  })

  addressSchema
    .virtual('cityUpper')
    .get(function () { return this.city?.toUpperCase() })

  // Avoid using subarray hooks
  addressSchema.pre('save', async function (next, options) { })
  addressSchema.pre('remove', async function (next, options) { })

  const employeeSchema = new Schema({
    name: String,
    age: Number,
    addresses: [addressSchema]
  });

  employeeSchema
    .virtual('initial')
    .get(function () { return this.name?.[0].toUpperCase() })

  employeeSchema.pre('save', async function (next, options) { })
  employeeSchema.pre('remove', function (next, options) { next() })

  employeeSchema.plugin(leanVirtuals)

  if (options.isExpress)
    employeeSchema.plugin(sanitizeJson)

  return employeeSchema
}