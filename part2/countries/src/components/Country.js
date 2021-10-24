import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [display, setDisplay] = useState(country)
  
  useEffect(() => {
    axios.get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.name.common}`)
    .then(res => {
      console.log(res.data)
      let countryWithWeather = {}
      Object.assign(countryWithWeather, display)
      countryWithWeather.temperature=res.data.current.temperature
      countryWithWeather.location=res.data.location.name
      countryWithWeather.weatherIcon=res.data.current.weather_icons[0]
      countryWithWeather.wind=`${res.data.current.wind_speed} mph direction ${res.data.current.wind_dir}`
      setDisplay(countryWithWeather)
    })
    .catch(err => console.error(err))
  }, [country, display])
  
  return (
    <div>
      <h1>{display.name.common}</h1>
      <p>capital {display.capital.join(', ')}</p>
      <p>population {display.population}</p>
      <h2>languages</h2>
      <ul>
        {Object.values(display.languages).map(lang =>
          <li key={lang}>{lang}</li>
        )}
      </ul>
      <img src={display.flags.png} alt={`${display.name.common}'s flag'`} height={100} width={100} />
      <h2>Weather in {country.capital[0]}</h2>
      <div>
        <p>
          <strong>temperature:</strong> {display.temperature} Celcius
        </p>
        <img src={display.weatherIcon} alt={display.weatherIcon}/>
        <p>wind: {display.wind}</p>
      </div>
    </div>
  )
}

export default Country