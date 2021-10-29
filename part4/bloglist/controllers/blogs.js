const userExtractor = require('../utils/middleware').userExtractor
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const opts = { new: true, runValidators: true }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, opts)
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({
      error: 'The blog with the specified id is not found, it might have been already deleted'
    })
  }

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    
    // update blogs property of user in users document
    user.blogs = user.blogs.filter(b => b._id.toString() !== blog.id)
    await user.save()

    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'a blog can only be deleted by the user who added the blog'
    })
  }
})

module.exports = blogsRouter