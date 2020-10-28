const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  name: {
    type: String
  },
  passwordHash: {
    type: String
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.Model('User', userSchema)

module.exports = User