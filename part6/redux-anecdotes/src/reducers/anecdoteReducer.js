import anecdoteService from '../services/anecdotes'

export const voteOnAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const data = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data
    })
  }
}

export const initAnecdotes = () => {
  return async (dispatch) => {
    const data = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data
    })
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