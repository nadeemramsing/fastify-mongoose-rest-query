const { Schema } = require('mongoose');
const leanVirtuals = require('mongoose-lean-virtuals')

const addressSchema = new Schema({
  street: String,
  city: String
})

const employeeSchema = new Schema({
  name: String,
  age: Number,
  addresses: [addressSchema]
});

employeeSchema
  .virtual('initial')
  .get(function () { return this.name[0].toUpperCase() })

employeeSchema.pre('save', async () => { })
employeeSchema.plugin(leanVirtuals)

module.exports = employeeSchema