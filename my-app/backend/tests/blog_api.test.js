const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcryptjs')
const User = require('../models/user')


describe('when there are some blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    await Blog.insertMany(helper.initialBlogs)
    console.log('saved')

    console.log('done')
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await helper.blogsInDb()

    const titles = response.map(r => r.title)

    expect(titles).toContain(
      'React patterns'
    )
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  describe('single blog tests', () => {
    test('a specific blog can be viewed', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(blogToView)
    })

    test('id instead of _id', async () => {
      const response = await helper.blogsInDb()
      expect(response[0].id).toBeDefined()
    })
  })

  describe('adding a blog', () => {
    test('a valid blog can be added ', async () => {
      const newUser = {
        'name': 'test user',
        'username': 'testuser',
        'password': 'testpassword'
      }

      testUser = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      testToken = await api
        .post('/api/login')
        .send({ 'username': newUser.username, 'password': newUser.password })
        .expect(200)

      const newBlog = {
        title: 'a valid blog',
        author: 'test author',
        url: 'test url',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + testToken.body.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain(
        'a valid blog'
      )
    })

    test('blog cant be added without a token', async () => {
      const newBlog = {
        title: 'an invalid blog',
        author: 'test author',
        url: 'test url',
        likes: 1
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without a title is not added, returns 400', async () => {
      const newBlog = {
        author: 'test author',
        url: 'test url',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken.body.token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without a url is not added, returns 400', async () => {
      const newBlog = {
        title: 'forgot something',
        author: 'test author',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken.body.token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs with undefined likes get 0 likes', async () => {
      const newBlog = {
        title: 'blog of unknown likes',
        author: 'test author',
        url: 'url to blog'
      }

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(res.body.likes).toEqual(0)
    })
  })

  describe('updating a blog', () => {
    test('liking a blog increases its likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes++

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
      expect(updatedBlog.body.likes).toEqual(blogToUpdate.likes)
    })
  })

  describe('deleting a blog', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      console.log(`/api/blogs/${blogToDelete.id}`)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${testToken.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const contents = blogsAtEnd.map(r => r.title)

      expect(contents).not.toContain(blogToDelete.title)
    })
  })
})

describe('db has a user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salaista', 10)
    const user = new User({ username: 'new', passwordHash })

    await user.save()
  })

  test('valid user can be added', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ristoml',
      name: 'Risto Leivo',
      password: 'piilotettu',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('return error when username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'new',
      name: 'another user',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username already exists')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('return error when username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ne',
      name: 'another user',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('return error when password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'new2',
      name: 'another user',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})