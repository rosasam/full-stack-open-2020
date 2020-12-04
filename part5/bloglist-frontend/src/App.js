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
    blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
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
      console.log(user)
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
      displayErrorMessage(`Could not add blog: ${exception.response.data.error}`)
    }
  }

  const addLike = async (updateBlog) => {
    try {
      const blog = await blogService.update(updateBlog.id, {
        title: updateBlog.title,
        author: updateBlog.author,
        url: updateBlog.url,
        likes: updateBlog.likes + 1,
        user: updateBlog.user.id
      })
      setBlogs(
        blogs
          .map(b => {
            return b.id === blog.id ? { ...b, likes: blog.likes } : b
          })
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (exception) {
      displayErrorMessage(`Could not like blog: ${exception.response.data.error}`)
    }
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} permanently?`)) {
      try {

        await blogService.delete_(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        displayInfoMessage('Blog deleted')
      } catch (exception) {
        displayErrorMessage(`Could not delete blog: ${exception.response.data.error}`)
      }
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
        <div>
          Logged in as {user.name}
          <button onClick={handleLogout}>logout</button>
        </div>
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
      {blogs.map((blog, i) =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={addLike}
          deleteBlog={deleteBlog}
          isOwnedByUser={user ? blog.user.username === user.username : false}
          last={i === blogs.length - 1}
        />
      )}
    </div>
  )
}

export default App