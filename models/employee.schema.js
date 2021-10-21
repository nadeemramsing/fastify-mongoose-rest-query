const { Schema } = require('mongoose');
const leanVirtuals = require('mongoose-lean-virtuals')

const addressSchema = new Schema({
  street: String,
  city: String
})

addressSchema
  .virtual('cityUpper')
  .get(function () { return this.city?.toUpperCase() })

addressSchema.pre('save', async () => { })
addressSchema.pre('remove', async () => { })

const employeeSchema = new Schema({
  name: String,
  age: Number,
  addresses: [addressSchema]
});

employeeSchema
  .virtual('initial')
  .get(function () { return this.name?.[0].toUpperCase() })

employeeSchema.pre('save', async () => { })
employeeSchema.pre('remove', function (next, options) { next() })

employeeSchema.plugin(leanVirtuals)

module.exports = employeeSchema