import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const filteredCountries = countries.filter(
    country => country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(result => setCountries(result.data))
      .catch(err => console.error(err))
  }, [])

  const handleFilter = (e) => setFilter(e.target.value)
  const handleShow = (name) => setFilter(name)
  
  return (
    <div>
      <Filter value={filter} onChange={handleFilter} />
      <Countries countries={filteredCountries} onShow={handleShow} />
    </div>
  )
}

export default App
