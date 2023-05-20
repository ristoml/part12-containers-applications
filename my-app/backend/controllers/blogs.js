const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { body: 1 })
  const parsedBlogs = blogs.map((blog) => blog.toJSON())
  response.json(parsedBlogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (blog.title && blog.url) {
    if (!blog.likes) blog.likes = 0
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  if (!request.body.comment) {
    return response.status(400).json({ error: 'empty request' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({ error: 'something went wrong' })
  }

  const comment = await Comment({
    body: request.body.comment,
    blog: blog.id
  })

  comment.save()
  blog.comments.push(comment.id)
  blog.save()

  response.status(201).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  const user = await User.find({ username: request.user })

  if (blog && request.user === user[0].username.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  } else {
    response.status(401).json({ error: 'invalid user or blog doesnt exists' })
  }
})

module.exports = blogsRouter
