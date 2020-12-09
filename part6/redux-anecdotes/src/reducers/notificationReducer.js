const initialState = {
  text: 'Hidden text',
  visibility: 'hidden'
}

export const showNotification = ( text ) => {
  return {
    type: 'SHOW_NOTIFICATION',
    data: { text, visibility: 'visible' }
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET_NOTIFICATION'
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.data
    case 'RESET_NOTIFICATION':
      return initialState

    default:
      return state
  }
}

export default reducer