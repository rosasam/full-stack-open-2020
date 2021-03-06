const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!(request.token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.status(200).json(blog)
  } else {
    response.status(404).send({ error: 'nonexistent id' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!(request.token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  if (!blog) {
    return response.status(404).send({ error: 'nonexistent id' })
  }

  if (decodedToken.id !== blog.user.toString()) {
    return response.status(401).send({ error: 'blog does not belong to user' })
  }

  const removed = await Blog.findByIdAndRemove(blogId)
  if (removed) {
    response.status(204).end()
  } else {
    response.status(404).send({ error: 'blog was already deleted' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!(request.token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = request.body
  const dbBlog = await Blog.findById(request.params.id)
  if (!dbBlog) {
    return response.status(404).send({ error: 'nonexistent id' })
  }

  if (decodedToken.id !== dbBlog.user.toString()) {
    return response.status(401).send({ error: 'blog does not belong to user' })
  }
  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updated) {
    response.status(200).json(updated)
  } else {
    response.status(404).send({ error: 'blog not found, it was probably deleted' })
  }
})

module.exports = blogsRouter