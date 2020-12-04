Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedInUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('newBlog', ({ title, author, url }) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/blogs',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
    }
  })
  // The blogs won't be visible on the page before refreshing
  cy.visit('http://localhost:3000')
})

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', { username: 'sammoa', password: 'lol123', name: 'sammoa' })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login').click()
    cy.contains('Log in to application')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('sammoa')
      cy.get('#password').type('lol123')
      cy.get('#login-button').click()
      cy.contains('Logged in as sammoa')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('sammoa')
      cy.get('#password').type('lol')
      cy.get('#login-button').click()

      cy.get('.error').as('errorMessage')
      cy.get('@errorMessage').should('contain', 'Wrong Credentials')
      cy.get('.error').should('have.css', 'background-color', 'rgb(139, 0, 0)')
      cy.get('html').should('not.contain', 'Logged in as sammoa')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'sammoa', password: 'lol123' })
    })

    it('A blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#title').type('test blog')
      cy.get('#author').type('testerson')
      cy.get('#url').type('http://wwww.testerson.com')
      cy.get('#add-blog').click()

      cy.get('.blog')
        .contains('test blog, testerson')
    })

    describe('When several blogs have been added', function() {
      beforeEach(function() {
        cy.newBlog({ title: 'blog1', author: 'author1', url: 'http://url1.dev' })
        cy.newBlog({ title: 'blog2', author: 'author2', url: 'http://url2.dev' })
        cy.newBlog({ title: 'blog3', author: 'author3', url: 'http://url3.dev' })
      })

      it('A blog can be liked', function() {
        cy.get('.blog').contains('blog1').as('blog1')
        cy.get('@blog1').parent().contains('view').click()
        cy.get('@blog1').parent().contains('like').click()

        cy.get('@blog1').parent().contains('likes: 1')
      })

      it('A blog can be deleted by the user who added it', function() {
        cy.get('.blog').contains('blog1').as('blog1')
        cy.get('@blog1').parent().contains('view').click()
        cy.get('@blog1').parent().contains('remove').click()

        cy.get('.blog').should('not.contain', 'blog1')
      })

      it('Blogs are ordered by likes', function() {
        cy.get('.blog').contains('blog1').as('blog1')
        cy.get('.blog').contains('blog2').as('blog2')
        cy.get('.blog').contains('blog3').as('blog3')
        cy.get('@blog2').parent().contains('view').click()
        cy.get('@blog2').parent().contains('like').click().click().click()
        cy.get('@blog3').parent().contains('view').click()
        cy.get('@blog3').parent().contains('like').click().click()

        cy.get('.blog').eq(0).contains('blog2')
        cy.get('.blog').eq(1).contains('blog3')
        cy.get('.blog').eq(2).contains('blog1')
      })

    })
  })
})