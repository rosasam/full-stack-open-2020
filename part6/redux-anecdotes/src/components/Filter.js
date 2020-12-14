import React from 'react'
import{ connect } from 'react-redux'
import { updateFilter } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
    props.updateFilter(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input
        onChange={handleChange}
        value={props.filter}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    filter: state.filter
  }
}

const mapDispatchToProps = {
  updateFilter
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)