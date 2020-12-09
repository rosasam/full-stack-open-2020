import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFilter } from '../reducers/filterReducer'

const Filter = () => {
  const filterValue = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(updateFilter(event.target.value))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input
        onChange={handleChange}
        value={filterValue}
      />
    </div>
  )
}

export default Filter