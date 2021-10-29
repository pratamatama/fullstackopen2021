const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
}, 100000)

describe('Blog model', () => {
  describe('GET requests', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('blogs are returned as json', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('there are two blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('the unique identifier property of the blog posts is named id', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })
  })

  describe('POST requests', () => {
    test('it should respond with 401 Unauthorized when token is not provided', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    
    test('a valid blog can be added', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain('Type wars')
    })

    test('if the likes property is missing, it will default to the value 0', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const likes = blogsAtEnd.map(n => n.likes)
      expect(likes).not.toContain(undefined)
    })

    test('if title and url props is missing, backend should respond with 400 Bad Request', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send({ author: 'Robert C. Martin', likes: 2 })
        .expect(400)
    })
  })

  describe('PUT requests', () => {
    test('a valid blog can be updated', async () => {
      const newBlog = { likes: 9999 }
      const blogsAtStart = await helper.blogsInDb()

      await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
      const likes = blogsAtEnd.map(n => n.likes)
      expect(likes).toContain(newBlog.likes)
    })
  })

  describe('DELETE requests', () => {
    test('a valid blog can be deleted', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }
        
      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(204)
      
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
      const ids = blogsAtEnd.map(r => r.id)
      expect(ids).not.toContain(createResponse.body.id)
    })
  })
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'donny',
      name: 'Donny Pratama',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('`username` to be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when password length is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'invalid',
      name: 'invalid user',
      password: 'p',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('must be at least 3 characters')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when username length is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'i',
      name: 'invalid user',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('shorter than the minimum allowed length')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})