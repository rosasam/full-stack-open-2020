const initialState = ''

export const updateFilter = (text) => {
  return {
    type: 'UPDATE_FILTER',
    data: text
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_FILTER':
      return action.data
    default:
      return state
  }
}

export default reducer