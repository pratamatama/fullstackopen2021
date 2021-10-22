import React from 'react'
import Input from './Input'

const Form = ({
  nameValue,
  onNameChange,
  numberValue,
  onNumberChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Input label="name" value={nameValue} onChange={onNameChange} />
      <Input label="number" value={numberValue} onChange={onNumberChange} />
      <div><button type="submit">add</button></div>
    </form>
  )
}

export default Form