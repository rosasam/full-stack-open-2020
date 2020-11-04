import React, { useState, useImperativeHandle } from 'react'

const Togglable = React.forwardRef(({ 
  children,
  showButtonLabel,
  hideButtonLabel
}, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // Makes toggleVisibility available outside the Togglable component,
  // contained in the ref passed to Togglable
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{showButtonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        { children }
        <button onClick={toggleVisibility}>{hideButtonLabel}</button>
      </div>
    </div>
  )
})

export default Togglable
