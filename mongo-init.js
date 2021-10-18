const mongoose = require('mongoose')

const models = require('./models')

const { Types: { ObjectId } } = mongoose
const EmployeeSchema = models.Employee.schema

module.exports = async uri => {
  await mongoose.connect(uri)

  const EmployeeModel = mongoose.model('Employee', EmployeeSchema)

  await EmployeeModel.create([
    {
      _id: ObjectId('616d829d0767b556f1bc90c5'),
      name: 'Nadeem',
      age: 28,
      addresses: [{ street: 'street1', city: 'Beau Bassin' }, { street: 'streetA', city: 'Curepipe' },]
    },
    {
      name: 'Samira',
      age: 24,
      addresses: [{ street: 'street2', city: 'Beau Bassin' }]
    },
    {
      name: 'Zakariyya',
      age: 5 / 12,
      addresses: [{ street: 'street3', city: 'Beau Bassin' }]
    }
  ])
}