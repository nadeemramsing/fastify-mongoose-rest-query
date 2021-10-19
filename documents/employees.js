const { Types: { ObjectId } } = require('mongoose')

module.exports = [
  {
    _id: ObjectId('616d829d0767b556f1bc90c1'),
    name: 'Nadeem',
    age: 28,
    addresses: [
      {
        _id: ObjectId('616d829d0767b556f1bc90c4'),
        street: 'street1',
        city: 'Beau Bassin'
      },
      {
        _id: ObjectId('616d829d0767b556f1bc90c5'),
        street: 'streetA',
        city: 'Curepipe'
      }
    ]
  },
  {
    _id: ObjectId('616d829d0767b556f1bc90c2'),
    name: 'Samira',
    age: 24,
    addresses: [
      {
        _id: ObjectId('616d829d0767b556f1bc90c6'),
        street: 'street2',
        city: 'Beau Bassin'
      }
    ]
  },
  {
    _id: ObjectId('616d829d0767b556f1bc90c3'),
    name: 'Zakariyya',
    age: 5 / 12,
    addresses: [
      {
        _id: ObjectId('616d829d0767b556f1bc90c7'),
        street: 'street3',
        city: 'Beau Bassin'
      }
    ]
  }
]