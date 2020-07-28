import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Header = ({text}) => <h1>{text}</h1>

const Button = ({handleClick, text}) =>
  <button onClick={handleClick}>{text}</button>

const VoteCounter = ({votes}) => <div>has {votes} votes</div>

const App = (props) => {
  const [selected, setSelected] = useState(0)
  // Initialize votes as an object where keys are indices for anecdotes and values the number of votes
  const [votes, setVotes] = useState({...(new Array(anecdotes.length).fill(0))})
  const [mostPopularAnecdote, setMostPopularAnecdote] = useState({text: anecdotes[0], votes: 0})

  const selectRandom = () => {
    let newSelected = selected
    // Make sure same number is not chosen again
    while (newSelected === selected) {
      newSelected = Math.floor(Math.random() * anecdotes.length)
    }
    setSelected(newSelected)
  }

  const addVote = () => {
    // Increments votes of the currently selected anecdote
    const voteAmount = votes[selected] + 1
    setVotes({...votes, [selected]: voteAmount})

    // Update most popular vote if applicable
    if (voteAmount > mostPopularAnecdote.votes) {
      setMostPopularAnecdote({text: anecdotes[selected], votes: voteAmount})
    }
  }

  return (
    <div>
      <Header text='Anecdote of the day' />
      <div>
        {props.anecdotes[selected]}
      </div>
      <VoteCounter votes={votes[selected]} />
      <div>
        <Button handleClick={addVote} text='vote' />
        <Button handleClick={selectRandom} text='next anecdote' />
      </div>
      <Header text='Anecdote with most votes' />
      <div>
        {mostPopularAnecdote.text}
      </div>
      <VoteCounter votes={mostPopularAnecdote.votes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Perfection (in design) is achieved not when there is nothing more to add, but rather when there is nothing more to take away.',
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)