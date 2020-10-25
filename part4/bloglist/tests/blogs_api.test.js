const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    author: 'Wei Shi Lindon',
    title: 'The Path of Twin Stars',
    url: 'google.com',
    likes: 3
  },
  {
    author: 'Yerin',
    title: 'The Path of The Endless Sword',
    url: 'google.com',
    likes: 2
  },
  {
    author: 'Eithan Arelius',
    title: 'Unknown Pure Madra Path',
    url: 'google.com',
    likes: 512
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs)
    const blogObject = new Blog(blog)
    blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})