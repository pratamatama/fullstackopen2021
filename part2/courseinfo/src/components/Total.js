import React from 'react'

const Total = ({ parts }) => {
  const { exercises } = parts.reduce((a, b) => ({exercises: a.exercises + b.exercises}))
  return <p>Number of exercises {exercises}</p>
}

export default Total