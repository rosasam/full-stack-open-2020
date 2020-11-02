const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { user: 0 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // Password validation
  if (body.password === undefined) {
    response.status(400).json({
      error: 'password must be given'
    })
    return
  } else if (body.password.length < 3) {
    response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const saved = await user.save()
  response.status(201).json(saved)
})

module.exports = usersRouter