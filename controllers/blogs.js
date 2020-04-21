const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs.map((blog) => blog.toJSON()))
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    ...body,
    likes: body.likes === undefined ? 0 : body.likes,
  })

  try {
    const savedNote = await blog.save()
    response.status(201).json(savedNote.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogRouter
