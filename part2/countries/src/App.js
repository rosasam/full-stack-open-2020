import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')

  const filteredCountries = countries.filter(
    country => country.name.toLowerCase().includes(countrySearch.toLowerCase())
  )

  // Fetch country data with axios (once)
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleCountrySearch = (event) => {
    setCountrySearch(event.target.value)
  }

  const handleCountryClick = (event) => {
    setCountrySearch(event.target.value)
  }

  // Conditional rendering for countries
  const countryDisplay = (countries) => {
    const len = countries.length
    if(len === 1) {
      return <Country country={filteredCountries[0]}/>
    } else if(len < 11) {
      return countries.map(c =>
        <div key={c.name}>
          {c.name}<button onClick={handleCountryClick} value={c.name}>show</button>
        </div>
      )
    } else {
      return <div>Too many matches, specify another filter</div>
    }
  }

  return (
    <div>
      Find countries <input value={countrySearch} onChange={handleCountrySearch} />
      {countryDisplay(filteredCountries)}
    </div>
  )
}

export default App