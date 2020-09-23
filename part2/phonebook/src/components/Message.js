import React from 'react'
import './Message.css'

const Message = ({ message }) => {
  if (message.text === null) {
    return null
  }

  return (
    <div className={`message ${message.type}`}>
      {message.text}
    </div>
  )
}

export default Message
