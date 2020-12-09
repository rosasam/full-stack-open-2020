import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers } from 'redux'

import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  notification: notificationReducer
})

const store = createStore(
  reducer,
  composeWithDevTools()
)

export default store