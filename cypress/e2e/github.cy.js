describe('GitHub Homepage', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the homepage with a sign-in button', () => {
    cy.getHealing(
      '[data-testid="header-signin-button"]',
      'sign in button in the header'
    ).should('be.visible')
  })

  it('has a working search input in the header', () => {
    cy.getHealing(
      '[data-testid="search-input"]',
      'search input or search trigger button in the GitHub header'
    ).should('exist')
  })

})

describe('GitHub Search', () => {

  it('searches for a repository and shows results', () => {
    cy.visit('/search?q=cypress+testing&type=repositories')

    cy.getHealing(
      '.repo-list',
      'list of repository search results'
    ).should('exist')
  })

})

describe('GitHub Repository Page', () => {

  beforeEach(() => {
    cy.visit('/cypress-io/cypress')
  })

  it('shows the file browser', () => {
    cy.getHealing(
      '[aria-label="Files"]',
      'file browser table showing the repository file structure'
    ).should('exist')
  })

  it('shows star and fork counts', () => {
    cy.getHealing(
      '#repo-stars-counter-star',
      'star count or starring button for the repository'
    ).should('exist')
  })

  it('has a README section', () => {
    cy.getHealing(
      '#readme',
      'README section at the bottom of the repository page'
    ).should('exist')
  })

})