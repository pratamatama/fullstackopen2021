import React, { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Options = ({ options }) => {
  options.map(
    (e) => <Button key={e.text} text={e.text} onClick={e.onClick} />
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistics = ({ statistics, hasFeedback }) => (
  <table>
    <tbody>
      {
        hasFeedback
          ? statistics.map((e) => <Statistic key={e.text} text={e.text} value={e.value} isPercent={e.isPercent} />)
          : <tr><td>No feedback given</td></tr>
      }
    </tbody>
  </table>
)

const Statistic = ({ text, value, isPercent }) => (
  <tr>
    <td>{text}</td>
    <td>{value} {isPercent && '%'}</td>
  </tr>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = (good - bad) / total || 0
  const positive = (good / total) * 100 || 0

  const options = [
    { text: 'good', onClick: () => setGood(good + 1) },
    { text: 'neutral', onClick: () => setNeutral(neutral + 1) },
    { text: 'bad', onClick: () => setBad(bad + 1) },
  ]

  const statistics = [
    { text: 'good', value: good, isPercent: false },
    { text: 'neutral', value: neutral, isPercent: false },
    { text: 'bad', value: bad, isPercent: false },
    { text: 'total', value: total, isPercent: false },
    { text: 'average', value: average, isPercent: false },
    { text: 'positive', value: positive, isPercent: true },
  ]

  return (
    <div>
      <Header text="give feedback" />
      <Options options={options} />
      <Header text="statistics" />
      <Statistics statistics={statistics} hasFeedback={total > 0} />
    </div>
  )
}

export default App;
