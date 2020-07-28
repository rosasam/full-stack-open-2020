import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Header = ({text}) => <h1>{text}</h1>

const Button = ({handleClick, text}) => 
  <button onClick={handleClick}>{text}</button>
  
const Statistic = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, bad, neutral}) => {
  const allFeedback = good + bad + neutral
  if (allFeedback === 0) {
    return <div>No feedback given</div>
  }

  // These values should only be calculated if allFeedback is not 0
  const average = (good - bad) / allFeedback
  const percentagePositive = 100 * good / allFeedback

  return (
    <table>
      <tbody>
        <Statistic text='good' value={good} />
        <Statistic text='neutral' value={neutral} />
        <Statistic text='bad' value={bad} />
        <Statistic text='all' value={allFeedback} />
        <Statistic text='average' value={average} />
        <Statistic text='positive' value={percentagePositive + '%'} />
      </tbody>
    </table>

  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text='Give Feedback' />
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad'/>
      <Header text='Statistics' />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)