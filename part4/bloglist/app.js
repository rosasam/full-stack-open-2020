const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

logger.info(`Connecting to ${config.MONGODB_URI}`)

mongoose.connect(
  config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    logger.info('connected to database')
  })
  .catch((error) => {
    logger.error('error connecting to database:', error.message)
  })


const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

// bind routers to correct endpoints
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app