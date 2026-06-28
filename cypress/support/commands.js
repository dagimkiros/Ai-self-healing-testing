Cypress.Commands.add('getHealing', (selector, elementHint, options = {}) => {
  const testName = Cypress.currentTest?.title || 'Unknown Test'

  return cy.get('body').then(($body) => {
    const elementExists = $body.find(selector).length > 0

    if (elementExists) {
      // Selector still works — no healing needed
      return cy.get(selector, options)
    }

    // Selector is broken — ask Claude to fix it
    cy.log(`⚠️ Selector failed: "${selector}" — asking Claude AI to heal...`)

    const domSnapshot = $body.prop('outerHTML')

    return cy.task('healSelector', {
      brokenSelector: selector,
      domSnapshot,
      elementHint: elementHint || selector,
      testName,
    }).then((result) => {
      if (result.confidence === 'none') {
        cy.log(`❌ AI healing failed. Falling back to original selector.`)
        return cy.get(selector, options)
      }

      cy.log(`✅ Healed to: "${result.selector}" (${result.confidence} confidence)`)
      cy.log(`   Reason: ${result.reasoning}`)

      return cy.get(result.selector, options)
    })
  })
})

Cypress.Commands.add('simulateBreakage', (selector) => {
  cy.get(selector).then(($el) => {
    const attrs = $el[0].attributes
    const dataAttrs = Array.from(attrs)
      .filter(a => a.name.startsWith('data-'))
      .map(a => a.name)

    dataAttrs.forEach(attr => $el.removeAttr(attr))
    cy.log(`💥 Simulated breakage on "${selector}"`)
  })
})