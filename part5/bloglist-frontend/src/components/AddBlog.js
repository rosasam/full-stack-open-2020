import React from 'react'

const AddBlog = (props) => {
  return (
    <div>
      <form onSubmit={props.handleNewBlog}>
        <div>
          Title
          <input
            type="text"
            name="Title"
            value={props.titleValue}
            onChange={({ target }) => props.setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            type="text"
            name="Author"
            value={props.authorValue}
            onChange={({ target }) => props.setAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input
            type="text"
            name="Url"
            value={props.urlValue}
            onChange={({ target }) => props.setUrl(target.value)}
          />
        </div>
        <button type='submit'>Add Blog</button>
      </form>
    </div>
  )
}

export default AddBlog
