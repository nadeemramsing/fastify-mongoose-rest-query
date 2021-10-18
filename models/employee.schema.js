const { Schema } = require('mongoose');

const addressSchema = new Schema({
  street: String,
  city: String
})

const employeeSchema = new Schema({
  name: String,
  age: Number,
  addresses: [addressSchema]
});

module.exports = employeeSchema