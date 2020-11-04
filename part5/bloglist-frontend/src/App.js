import React, { useState, useEffect, useRef } from 'react'
import Login from './components/Login'
import Blog from './components/Blog'
import AddBlog from './components/AddBlog'
import Message from './components/Message'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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

  const createBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      displayInfoMessage(`a new blog ${blog.title} by ${blog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      displayErrorMessage('Adding blog failed')
    }
  }

  const loginForm = () => {
    return (
      <Togglable 
          showButtonLabel={'login'}
          hideButtonLabel={'cancel'}
        >
          <Login 
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
      </Togglable>
    )
  }

  const userInfo = () => {
    return (
      <div>
        <div>{user.name} logged-in</div>
        <button onClick={handleLogout}>logout</button>
      </div>
    )
  }

  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <Togglable
        showButtonLabel={'New Blog'}
        hideButtonLabel={'cancel'}
        ref={blogFormRef}
      >
        <AddBlog createBlog={createBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Message 
        message={message}
      />
      {user === null ?
        loginForm()
        :
        <div>
          <div>
            {userInfo()}
          </div>
          <div>
            {blogForm()}
          </div>
        </div>
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App