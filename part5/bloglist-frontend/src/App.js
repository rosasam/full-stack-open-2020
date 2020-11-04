import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import AddBlog from './components/AddBlog'
import Message from './components/Message'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState({ text: null, class: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedInUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayMessage = (text, className, timeout) => {
    console.log(text)
    setMessage({
      text,
      class: className
    })
    setTimeout(() => {
        setMessage({
          text: null,
          class: null,
        })
      }, timeout) 
  }

  const displayErrorMessage = text => {
    displayMessage(text, 'error', 4000)
  }

  const displayInfoMessage = text => {
    displayMessage(text, 'info', 2000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      displayErrorMessage('Wrong Credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
    displayInfoMessage('Logged out successfully')
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url,
    }
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      displayInfoMessage(`a new blog ${blog.title} by ${blog.author} added`)
    } catch (exception) {
      displayErrorMessage('Adding blog failed')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Message 
          message={message}
        />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text' 
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input 
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
         <button type='submit'>login</button> 
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Message 
        message={message}
      />
      <div>
        <div>{user.name} logged-in</div>
        <button onClick={handleLogout}>logout</button>
      </div>
      <AddBlog
        titleValue={title}
        authorValue={author}
        urlValue={url}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
        handleNewBlog={handleNewBlog}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App