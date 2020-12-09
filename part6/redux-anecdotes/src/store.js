import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers } from 'redux'

import reducer from './reducers/anecdoteReducer'

const store = createStore(
  reducer,
  composeWithDevTools()
)

export default store