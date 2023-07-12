import React, { useState, useEffect } from 'react'
import FilterForm from './components/FilterForm'
import PersonForm from './components/PersonsForm'
import personService from './services/Persons'
import Persons from './components/Persons'
import { Notification, SuccessNotification } from './components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

    // Noudetaan henkilöt palvelimelta
    useEffect(() => {
      personService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
    }, [])

  // Käsittelijät nimelle, numerolle ja suodattimelle
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

// Käsittelee uuden henkilön lisäämisen lomakkeessa
const addPerson = (event) => { 
  event.preventDefault()

  if (newName === '' || newNumber === '') {
    setErrorMessage('Both name and number fields are mandatory, please fill the missing one(s)')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    return
  }

  const personObject = {
    name: newName,
    number: newNumber,
  }

  // Tarkistetaan dublikaattihenkilöt
  const existingPerson = persons.find(person => person.name === newName)
  if (existingPerson) {
    if(window.confirm(`${newName} already exists in the phonebook, replace the old number with a new one?`)){
      personService
        .update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Updated ${returnedPerson.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`Functionality yet to be implemented`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== existingPerson.id))
        })
    }
  } else {
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
  }

// Konktaktin poistaminen
const removePerson = (id) => {
  const personToRemove = persons.find(p => p.id === id)

  if (window.confirm(`Delete ${personToRemove.name} ?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(n => n.id !== id))
        setSuccessMessage(`Removed ${personToRemove.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(
          `The person '${personToRemove.name}' was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(n => n.id !== id))
      })
  }
}


  // Näytetään vain suodatetut henkilöt
  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

    return (
      <div>
        <h2>Phonebook</h2>
        <Notification message={errorMessage} />
        <SuccessNotification message={successMessage} />

        <FilterForm value={filter} onChange={handleFilterChange} />
  
        <h3>Add new</h3>
        <PersonForm onSubmit={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
  
        <h3>Numbers</h3>
        <Persons personsToShow={personsToShow} handleRemove={removePerson} />
      </div>
    )
  }

export default App
