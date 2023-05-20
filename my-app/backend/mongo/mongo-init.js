db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'blog_app'
    },
    { role: 'dbOwner', db: 'test_blog_app' }
  ]
})

db.createCollection('blog_app')
db.createCollection('test_blog_app')
