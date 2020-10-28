const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  }

  if (error.name === 'CastError') {
    response.status(404).send({ error: 'invalid id' })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}