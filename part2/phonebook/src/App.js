import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Form from './components/Form'
import Input from './components/Input'
import Persons from './components/Persons'

const App = () => {
  const [person, setPerson] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const filteredPerson = person.filter(
    p => p.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => setPerson(response.data))
      .catch(err => console.error(err))
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newName || !newNumber) {
      return alert('Please fill all the field')
    }

    const notRegistered = person.findIndex(p => p.name.toLowerCase() === newName.toLowerCase()) === -1
    if (notRegistered) {
      setPerson(person.concat({ name: newName, number: newNumber }))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} is already added to phonebook`)
    }
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
      <Persons persons={filteredPerson} />
    </div>
  )
}

export default App;
