import React from 'react'
import './Message.css'

const Message = ({ message }) => {
  if (message.text === null) {
    return null
  }

  return (
    <div className={`message ${message.class}`}>
      <p>{message.text}</p>
    </div>
  )
}

export default Message
