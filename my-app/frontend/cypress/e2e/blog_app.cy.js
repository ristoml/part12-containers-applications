describe('Blog app ', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('')
    const user = {
      name: 'Risto Leivo',
      username: 'ristoml',
      password: 'passu'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
  })

  it('Front page can be opened', function () {
    cy.contains('Blogs')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      cy.get('#username').type('ristoml')
      cy.get('#password').type('passu')      
      cy.get('form').submit()
      cy.contains('Risto Leivo logged in')
    })

    it('Fails with wrong credentials', function () {
      cy.get('#username').type('ristom')
      cy.get('#password').type('pass')      
      cy.get('form').submit()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('ristoml')
      cy.get('#password').type('passu')     
      cy.get('form').submit()
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#blogFormTitle').type('cypress title')
      cy.get('#blogFormAuthor').type('cypress author')
      cy.get('#blogFormUrl').type('cypress url')
      cy.contains('create').click()
      cy.contains('cypress title')
      cy.contains('cypress author')
    })
  })
})
