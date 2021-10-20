const mongoose = require('mongoose')

const models = require('./models')
const employees = require('./documents/employees')

const EmployeeSchema = models.Employee.schema

module.exports = async uri => {
  await mongoose.connect(uri)

  const EmployeeModel = mongoose.model('Employee', EmployeeSchema)

  await EmployeeModel.create(employees)
}