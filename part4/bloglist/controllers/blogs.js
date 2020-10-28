const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    ...body,
    likes: body.likes ? body.likes : 0
  })
  const result = await blog.save()
  response.status(201).json(result)
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