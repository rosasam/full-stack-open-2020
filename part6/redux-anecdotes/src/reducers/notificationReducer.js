const initialState = 'Placeholder Notification'

export const updateNotification = ( text ) => {
  return {
    type: 'NOTIFICATION',
    data: text
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NOTIFICATION':
      return action.data

    default:
      return state
  }
}

export default reducer