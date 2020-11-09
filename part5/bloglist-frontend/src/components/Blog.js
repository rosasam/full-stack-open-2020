import React, { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, isOwnedByUser, last }) => {
  const blogStyle = {
    padding: 10,
    width: 400,
    border: '1px solid #aaa',
    borderBottom: '0px solid',
  }
  if (last) {
    blogStyle.borderBottom = '1px solid #aaa'
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}, {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes: {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        <button
          style={{ backgroundColor: 'red', display: isOwnedByUser ? '' : 'none' }}
          onClick={() => deleteBlog(blog)}>remove</button>
      </div>
    </div>
  )
}

export default Blog
