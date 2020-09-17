import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import AddPerson from './components/AddPerson'
import Search from './components/Search'
import axios from 'axios'


const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchQuery, setSearchQuery ] = useState('')
  
  const shownPersons = persons.filter(
    person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Fetch Persons from JSON database
  useEffect(() => axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    }), [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).includes(newName)) {
      window.alert(`${newName} is already added to phonebook`)
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        <h2>Search</h2>
        <Search 
          searchQuery={searchQuery} 
          searchQueryHandler={handleSearchQueryChange} 
        />
      </div>
      <div>
        <h2>Add Contact</h2>
        <AddPerson
          nameValue={newName}
          numberValue={newNumber}
          nameHandler={handleNameChange}
          numberHandler={handleNumberChange}
          submitHandler={addPerson}
        />
      </div>
      <div>
        <h2>Numbers</h2>
        <Persons
          persons={shownPersons}
        />
      </div>
    </div>
  )
}

export default App