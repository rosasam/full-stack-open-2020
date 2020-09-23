import React from 'react'

const Persons = ({ persons, deleteHandler }) => {
  return (
    <ul>
      {persons.map(person => 
        <Person 
          key={person.id}
          person={person}
          deleteHandler={() => deleteHandler(person.id)}
        />
      )}
    </ul>
  )
}

const Person = ({ person, deleteHandler }) => {
    return (
      <li>
        {person.name} {person.number} 
        <button onClick={deleteHandler}>delete</button>
      </li>)
}

export default Persons
