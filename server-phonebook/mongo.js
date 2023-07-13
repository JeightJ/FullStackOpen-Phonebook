const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Write the password along with the command, like this: node mongo.js <password> <"name"> <number>')
  process.exit(1)
}



// Tallennetaan salasana ja luodaan url
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.39l2l6n.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Luodaan Person-modeli
const Person = mongoose.model('Person', personSchema)

// Uuden henkilön lisäys
const addPerson = (name, number) => {
  const person = new Person({ name, number })
  
  person.save().then(() => {
    console.log(`Added ${name} with the number of ${number} to phonebook`)
    mongoose.connection.close()
  })
}

// Henkilöiden haku
const getPersons = () => {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// Jos 5, lisätään uusi henkilö
// Jos 3, haetaan henkilöt
if (process.argv.length === 5) {
  addPerson(process.argv[3], process.argv[4])
} else if (process.argv.length === 3) {
  getPersons()
}
