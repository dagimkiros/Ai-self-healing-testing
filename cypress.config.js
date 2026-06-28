const { defineConfig } = require('cypress')
const { healingPlugin } = require('./cypress/plugins/healing-plugin')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://github.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      healingPlugin(on, config)
      return config
    },
  },
})