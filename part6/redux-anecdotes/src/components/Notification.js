import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    visibility: notification.visibility
  }
  return (
    <div style={style}>
      {notification.text}
    </div>
  )
}

export default Notification