import React, {useState} from 'react'

const Blog = ({ blog }) => {
  const blogStyle = {
    margin: 10,
    padding: 10,
    width: 400,
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)'
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
        <div>likes: {blog.likes}</div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog
