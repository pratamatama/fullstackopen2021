require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[2]
const number = process.argv[3]

if (!name || !number) {
  console.log('phonebook:')
  Person.find({}).then(result => {
      result.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    }).catch(err => console.error(err))
} else {
  const person = new Person({ name, number })
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => console.error(err))
}
