import React from 'react'

const Notification = ({ message, isSuccess }) => {
  const className = isSuccess
    ? 'notifications notifications-success'
    : 'notifications notifications-error'
  
  return (
    <div className={className}>
      <p className="notifications__message">{message}</p>
    </div>
  )
}

export default Notification