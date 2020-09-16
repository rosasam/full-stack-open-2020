import React from 'react'

const Search = ({searchQuery, searchQueryHandler}) => {
    return (
        <div>Filter by name: <input value={searchQuery} onChange={searchQueryHandler}/></div>
    )
}

export default Search
