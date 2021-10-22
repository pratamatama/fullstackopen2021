import React, { useState } from 'react'
import Form from './components/Form'
import Input from './components/Input'
import Persons from './components/Persons'

const App = () => {
  const [person, setPerson] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const filteredPerson = person.filter(
    p => p.name.toLowerCase().includes(filter.toLowerCase())
  )
  
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
