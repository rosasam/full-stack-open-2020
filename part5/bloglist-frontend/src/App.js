import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = usetState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handeLogin = (event) => {
    event.preventDefault()
    loginService.login
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form>
          <div>
          <input></input>
          </div>
          
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App