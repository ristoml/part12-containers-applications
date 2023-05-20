const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  body: {
    type: String
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    delete returnedObject.blog
  }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment