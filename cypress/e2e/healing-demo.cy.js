describe('🩺 AI Self-Healing Demo — GitHub.com', () => {

  it('heals a broken sign-in button selector', () => {
    cy.visit('/')

    cy.getHealing(
      '.totally-wrong-classname-that-doesnt-exist',
      'sign in button in the top navigation header'
    ).should('exist')
  })

  it('heals a broken search bar selector', () => {
    cy.visit('/')

    cy.getHealing(
      '#search-input-DEPRECATED',
      'search input or search trigger button in the GitHub header'
    ).should('exist')
  })

  it('heals a broken file browser selector', () => {
  cy.visit('/cypress-io/cypress')

  // Scroll down so the file browser is in view before we capture the DOM
  cy.scrollTo(0, 400)

  cy.getHealing(
    '.file-table-RENAMED',
    'grid or table element containing the list of files and folders in the repository, typically has role=grid or contains file names like src, package.json'
  ).should('exist')
})

  it('heals a broken star button selector', () => {
    cy.visit('/cypress-io/cypress')

    cy.getHealing(
      'button[aria-label="WRONG_LABEL"]',
      'star button or starring link for the repository'
    ).should('exist')
  })

})