import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import Input from './components/Input'
import Persons from './components/Persons'
import PersonService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const filteredPerson = persons.filter(
    p => p.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    PersonService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(err => console.error(err))
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)
  
  const clearInput = () => {
    setNewName('')
    setNewNumber('')
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newName || !newNumber) {
      return alert('Please fill all the field')
    }

    const index = persons.findIndex(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    index === -1
      ? createPerson()
      : updatePerson(persons[index])
  }

  const createPerson = () => {
    PersonService
      .create({ name: newName, number: newNumber})
      .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
      .then(_ => clearInput())
      .catch(err => console.error(err))
  }

  const updatePerson = (person) => {
    const confirmed = window.confirm(
      `${person.name} is already added to phonebook, replace old number with a new one?`
    )

    if (!confirmed) return

    PersonService
      .update(person.id, { name: newName, number: newNumber })
      .then(returnedPerson => setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson)))
      .then(_ => clearInput())
      .catch(err => console.error(err))
  }

  const deletePerson = (person) => {
    const confirmed = window.confirm(`Delete ${person.name} ?`)    
    
    if (!confirmed) return

    PersonService
      .destroy(person.id)
      .then(_ => setPersons(persons.filter(p => p.id !== person.id)))
      .catch(err => console.error(err))
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Input
        label="filter shown with"
        value={filter}
        onChange={handleFilterChange}
      />
      
      <h2>add a new</h2>
      <Form
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
        onSubmit={handleSubmit}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPerson} onDelete={deletePerson} />
    </div>
  )
}

export default App;
