import React from 'react'

const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={onDelete}>delete</button>
    </p>
  )
}

export default Person