const initialState = {
  text: 'Hidden text',
  visibility: 'hidden',
  timeoutID: null
}

export const showNotification = (text, timeout) => {
  return (dispatch, getState) => {
    const oldTimeoutID = getState().notification.timeoutID
    if (oldTimeoutID) {
      clearTimeout(oldTimeoutID)
    }

    const newTimeoutID = setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION',
        text,
        timeoutID: null
      })
    }, timeout * 1000)

    dispatch({
      type: 'SHOW_NOTIFICATION',
      text,
      timeoutID: newTimeoutID
    })
    
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        text: action.text,
        visibility: 'visible',
        timeoutID: action.timeoutID
      }
    case 'HIDE_NOTIFICATION':
      return initialState
    default:
      return state
  }
}

export default reducer