const blogsRouter = require('express').Router()
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

  // TODO: Handle invalid ids
  const user = await User.findById(body.userId)
  
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
  const removed = await Blog.findByIdAndRemove(request.params.id)
  if (removed) {
    response.status(204).end()
  } else {
    response.status(404).send({ error: 'nonexistent id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updated) {
    response.status(200).json(updated)
  } else {
    response.status(404).send({ error: 'nonexistent id' })
  }
})

module.exports = blogsRouter