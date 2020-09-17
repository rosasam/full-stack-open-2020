import React from 'react'
import Weather from './Weather'

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <table>
        <tbody>
          <tr>
            <td>Capital: </td><td>{country.capital}</td>
          </tr>
          <tr>
            <td>Population: </td><td>{country.population}</td>
          </tr>
        </tbody>
      </table>
     <h2>Languages</h2>
     <ul>
        {country.languages.map(language => 
          <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag} alt={`Flag of ${country.name}`} width='200'/>
      <Weather country={country}/>
    </div>
  )
}

export default Country
