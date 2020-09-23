import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import AddPerson from './components/AddPerson'
import Search from './components/Search'
import Message from './components/Message'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ message, setMessage ] = useState({text: null, type: ''})
  
  const shownPersons = persons.filter(
    person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Handle input fields
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // GET persons from JSON database
  useEffect(() => {
    personService
    .getAll()
    .then(persons => setPersons(persons))
  }, [])

  // CREATE person
  const addPerson = (event) => {
    event.preventDefault()
    // Attempt to update number if the name is already in the phonebook
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      updateNumber(existingPerson.id, newNumber)
      // Intentionally return before "wiping" the input fields.
      // This feels like the most natural beahviour after clicking cancel.
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }
    // The returned person object also contains the id created on the server
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage({text:`Added ${returnedPerson.name}`, type: ''})
        setTimeout(() => resetMessage(), 3000)
      })

    setNewName('')
    setNewNumber('')
  }

  // UPDATE person
  const updateNumber = (id, newNumber) => {
    const person = persons.find(p => p.id === id)
    if (!window.confirm(
      `${person.name} is already added to the phonebook,` +
      `replace the old number with a new one?`)) {
      return
    }

    const newPerson = {...person, number: newNumber}
    personService
      .update(id, newPerson)
      .then(updatedPerson => {
        setPersons(persons.map(p => p.id !== id ? p : updatedPerson))
        setMessage({text: `Updated number of ${updatedPerson.name} to '${updatedPerson.number}'`, type: ''})
        setTimeout(() => resetMessage(), 3000)
      })
      .catch(error => handleServerError(error, person))

    setNewName('')
    setNewNumber('')
  }

  // DELETE person
  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .delete_(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage({text: `Deleted ${person.name}`, type: ''})
          setTimeout(() => resetMessage(), 3000) 
        })
        .catch(error => handleServerError(error, person))
    }  
  }

  // Handles server errors "gracefully" (debatable if alert is graceful),
  // assuming that errors stem from trying to interact with an already deleted object
  const handleServerError = (error, person) => {
    setMessage({
      text: `Information of ${person.name} was already deleted from the server.`,
      type: 'error'
    })
    setTimeout(() => resetMessage(), 5000)
    setPersons(persons.filter(p => p.id !== person.id))
  }

  // Convenience function to reset message text and class to empty
  const resetMessage = () => setMessage({text: null, type: ''})

  return (
    <div>
      <h1>Phonebook</h1>
        <Message
          message={message}
        />
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
          deleteHandler={deletePerson}
        />
      </div>
    </div>
  )
}

export default App