const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let auth = {}

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
]

describe('blog router', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map((blog) => new Blog(blog))

    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })
  describe('the state of blog and its id property', () => {
    test('should return blog post in the JSON format', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('should return the correct amount of blogs in the database', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('verify that the unique identifier property of the blog post is named id', async () => {
      const response = await api.get('/api/blogs')

      const id = response.body.map((r) => r.id)
      expect(id).toBeDefined()
    })
  })

  describe('addition of new blog content', () => {
    test('should verify that making POST request is successful', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('authorization', auth.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const blogTitle = response.body.map((c) => c.title)

      expect(response.body).toHaveLength(initialBlogs.length + 1)
      expect(blogTitle).toContain(newBlog.title)
    })

    test('should return 400, if the title and url properties are missing', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('default likes property', () => {
    test('should verify if the likes property is missing from the request, it will default to the value zero', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      const response = await api.post('/api/blogs').send(newBlog).expect(201)

      expect(response.body.likes).toEqual(0)
    })
  })

  describe('deletion of blog', () => {
    test('should succeeds with status code 204 if id is valid', async () => {
      const blogAtstart = await api.get('/api/blogs')
      const blogToDelete = blogAtstart.body[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const bloglistAtEnd = await api.get('/api/blogs')
      expect(bloglistAtEnd.body).toHaveLength(initialBlogs.length - 1)

      const blogIds = bloglistAtEnd.body.map((b) => b.id)

      expect(blogIds).not.toContain(blogToDelete.id)
    })
  })
})

describe('users routers', () => {
  describe('when there is initially one user in the database', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('secret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('should successfully creat a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'decorouz',
        name: 'Biola Adeyemi',
        password: 'appointments',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const username = usersAtEnd.map((u) => u.username)
      expect(username).toContain(newUser.username)
    })

    test('should fail with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Game of throne',
        password: 'appointments',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('should check that invalid users are not created', async () => {
      const newUser = {
        username: undefined || 'ne',
        name: 'Adeyemi Biola',
        password: 'appointments',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toMatch('User validation failed')
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
