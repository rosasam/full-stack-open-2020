export const voteOnAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data
  }
}

export const initAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  }
} 

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      return state
        .map((anecdote) => ({
          ...anecdote,
          votes: anecdote.id === action.data.id ? anecdote.votes + 1 : anecdote.votes
        }))
        .sort((a, b) => b.votes - a.votes)

    case 'NEW_ANECDOTE':
      return state.concat(action.data)

    case 'INIT_ANECDOTES':
      return action.data

    default:
      return state
  }
}

export default reducer