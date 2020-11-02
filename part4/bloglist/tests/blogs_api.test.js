const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('root', 10)
  const user = {
    passwordHash,
    name: 'root',
    username: 'root',
    blogs: helper.initialBlogs.map(b => b._id)
  }
  const userObject = new User(user)
  const savedUser = await userObject.save()

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog({
      ...blog,
      user: savedUser._id
    })
    await blogObject.save()
  }

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }
  const jwtToken = jwt.sign(userForToken, process.env.SECRET)
  token = `Bearer ${jwtToken}`
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
  })

  test('the unique identifier property of blogs is named "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('viewing one blog', () => {
  test('succeeds with valid id', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    const result = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlog = JSON.parse(JSON.stringify(blog))
    expect(result.body).toEqual(processedBlog)
  })

  test('fails (404) with nonexistent id', async () => {
    const fakeId = await helper.fakeId()

    await api
      .get(`/api/blogs/${fakeId}`)
      .expect(404)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const blogTitle = 'Path of Twin Stars'
    const newBlog = {
      'title': blogTitle,
      'author': 'Wei Shi Lindon',
      'url': 'https://www.willwight.com/a-blog-of-dubious-intent',
      'likes': 50426
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(blogTitle)
  })

  test('succeeds without likes in the request', async () => {
    const blogTitle = 'Path of The Hollow King'
    const newBlog = {
      'title': blogTitle,
      'author': 'Eithan Arelius',
      'url': 'https://www.willwight.com/a-blog-of-dubious-intent',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body.pop().likes).toEqual(0)
  })

  test('fails when title and url are missing', async () => {
    // TODO: Should test each missing field separately
    const newBlog = {
      'author': 'Eithan Arelius',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('fails when no token is provided', async () => {
    const blogTitle = 'Path of Twin Stars'
    const newBlog = {
      'title': blogTitle,
      'author': 'Wei Shi Lindon',
      'url': 'https://www.willwight.com/a-blog-of-dubious-intent',
      'likes': 50426
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('token missing or invalid')
  })
})

describe('deletion of a blog', () => {
  test('succeeds if token and id is valid', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('fails (404) if id is nonexistent', async () => {
    const fakeId = await helper.fakeId()

    await api
      .delete(`/api/blogs/${fakeId}`)
      .set('Authorization', token)
      .expect(404)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
  })

  test('fails if token is invalid', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('token missing or invalid')
  })
})

describe('updating a blog', () => {
  test('succeeds with valid id and data', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = {
      id: blogsBefore[0].id,
      likes: blogsBefore[0].likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', token)
      .send(blogToUpdate)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
    expect(blogsAfter[0].likes).toEqual(blogToUpdate.likes)
  })

  test('fails with nonexistent id', async () => {
    const fakeId = await helper.fakeId()

    await api
      .put(`/api/blogs/${fakeId}`)
      .set('Authorization', token)
      .send({ title: 'temp' })
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})