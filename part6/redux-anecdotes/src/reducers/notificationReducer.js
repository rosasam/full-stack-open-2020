const initialState = {
  text: 'Hidden text',
  visibility: 'hidden'
}

export const showNotification = (text, timeout) => {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      text
    })
    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION',
        text
      })
    }, timeout * 1000)
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        text: action.text,
        visibility: 'visible'
      }
    case 'HIDE_NOTIFICATION':
      return action.text === state.text ? initialState : state
    default:
      return state
  }
}

export default reducer