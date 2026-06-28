import './commands'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver')) return false
  if (err.message.includes('Non-Error promise rejection')) return false
})