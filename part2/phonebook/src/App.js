import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import Input from './components/Input'
import Persons from './components/Persons'
import PersonService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationSuccess, setNotificationSuccess] = useState(true)
  
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

  const showSuccessNotification = (message) => {
    setNotificationMessage(message)
    setNotificationSuccess(true)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const showErrorNotification = (message) => {
    setNotificationMessage(message)
    setNotificationSuccess(false)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }
  
  const createPerson = () => {
    PersonService
      .create({ name: newName, number: newNumber})
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        clearInput()
        showSuccessNotification(`Added ${returnedPerson.name}`)
      }).catch(err => {
        console.error(err)
        showErrorNotification(err.response.data.error)
      })
  }

  const updatePerson = (person) => {
    const confirmed = window.confirm(
      `${person.name} is already added to phonebook, replace old number with a new one?`
    )

    if (!confirmed) return

    PersonService
      .update(person.id, { name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        clearInput()
        showSuccessNotification(`Updated ${returnedPerson.name}`)
      }).catch(err => {
        console.error(err)
        showErrorNotification(err.response.data.error)
      })
  }

  const deletePerson = (person) => {
    const confirmed = window.confirm(`Delete ${person.name} ?`)    
    
    if (!confirmed) return

    PersonService
      .destroy(person.id)
      .then(_ => setPersons(persons.filter(p => p.id !== person.id)))
      .catch(err => {
        console.error(err)
        showErrorNotification(`Information of ${person.name} has already been removed from server`)
      })
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      {showNotification &&
        <Notification
          message={notificationMessage}
          isSuccess={notificationSuccess}
        />
      }
      
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
