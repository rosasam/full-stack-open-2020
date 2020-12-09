import anecdoteService from '../services/anecdotes'

export const voteOnAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = {...anecdote, votes: anecdote.votes + 1 }
    const updatedAnecdote = await anecdoteService.update(newAnecdote)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    })
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
          votes: anecdote.id === action.data.id ? action.data.votes : anecdote.votes
        }))
        .sort((a, b) => b.votes - a.votes)

    case 'NEW_ANECDOTE':
      return state.concat(action.data)

    case 'INIT_ANECDOTES':
      return action.data.sort((a, b) => b.votes - a.votes)

    default:
      return state
  }
}

export default reducer