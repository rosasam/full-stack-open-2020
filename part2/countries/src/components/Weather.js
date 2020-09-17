import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
  const apiKey = process.env.REACT_APP_API_KEY
  const [ weather, setWeather] = useState()
  
  useEffect(() => {
    const params = {
      access_key: apiKey,
      query: country.capital
    }
    console.log(params)
    axios
      .get('http://api.weatherstack.com/current', {params})
      .then(response => {
        setWeather(response.data.current)
        console.log(response.data)
      })
    
  }, [country, apiKey])

  return (
    <div>
      <h2>
        Weather in {country.capital}
      </h2>
        {weather ?
        <>
          <img src={weather.weather_icons[0]} width='80'></img>
          <table>
            <tbody>
              <tr>
                <td>Observation time: </td>
                <td>{weather.observation_time}</td>
              </tr>
              <tr>
                <td>Temperature: </td>
                <td>{weather.temperature} C</td>
              </tr>
              <tr>
                <td>Wind: </td><td>{weather.wind_speed} mph</td>
              </tr>
              <tr>
                <td>Wind Direction: </td><td>{weather.wind_dir}</td>
              </tr>
            </tbody>
          </table>
        </>
        :
        <div>Fetcing weather data...</div>
      }
    </div>
  )
}

export default Weather
