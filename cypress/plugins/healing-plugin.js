const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs')
const path = require('path')

const HEAL_LOG_PATH = path.join(__dirname, '../logs/heals.json')

async function askClaudeToHeal(brokenSelector, domSnapshot, elementHint) {
  const client = new Anthropic.Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const trimmedDOM = domSnapshot.slice(0, 15000)

  const prompt = `You are an expert QA automation engineer specializing in CSS selectors and DOM analysis.

A Cypress test is failing because this selector no longer matches any element:
BROKEN SELECTOR: "${brokenSelector}"

The test is looking for: "${elementHint}"

Here is the current DOM of the page (trimmed for context):
\`\`\`html
${trimmedDOM}
\`\`\`

Your job:
1. Analyze the DOM to find the element that best matches what the test is looking for
2. Return a NEW selector that will reliably find that element
3. Prefer selectors in this order:
   - data-testid attributes (most stable)
   - aria-label attributes
   - Unique IDs
   - Specific class + tag combinations
   - Avoid generic classes that match many elements

Respond ONLY with a JSON object, no markdown, no explanation outside the JSON:
{
  "selector": "YOUR_NEW_SELECTOR_HERE",
  "reasoning": "Brief explanation of why this selector is better",
  "confidence": "high|medium|low"
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].text.trim()
  const cleaned = rawText.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const selectorMatch = rawText.match(/"selector"\s*:\s*"([^"]+)"/)
    return {
      selector: selectorMatch ? selectorMatch[1] : brokenSelector,
      reasoning: 'JSON parse failed; extracted via regex',
      confidence: 'low',
    }
  }
}

function logHeal(healEvent) {
  let log = []

  if (fs.existsSync(HEAL_LOG_PATH)) {
    try {
      log = JSON.parse(fs.readFileSync(HEAL_LOG_PATH, 'utf8'))
    } catch {
      log = []
    }
  }

  log.push({
    ...healEvent,
    timestamp: new Date().toISOString(),
  })

  fs.mkdirSync(path.dirname(HEAL_LOG_PATH), { recursive: true })
  fs.writeFileSync(HEAL_LOG_PATH, JSON.stringify(log, null, 2))

  console.log(`\n🩺 HEALED: "${healEvent.brokenSelector}" → "${healEvent.newSelector}"`)
  console.log(`   Reason: ${healEvent.reasoning}`)
  console.log(`   Confidence: ${healEvent.confidence}\n`)
}

function healingPlugin(on, config) {
  on('task', {
    async healSelector({ brokenSelector, domSnapshot, elementHint, testName }) {
      console.log(`\n🔍 Self-healing triggered in: "${testName}"`)
      console.log(`   Broken selector: "${brokenSelector}"`)

      try {
        const result = await askClaudeToHeal(brokenSelector, domSnapshot, elementHint)

        logHeal({
          testName,
          brokenSelector,
          newSelector: result.selector,
          reasoning: result.reasoning,
          confidence: result.confidence,
          elementHint,
        })

        return result
      } catch (error) {
        console.error('❌ Healing failed:', error.message)
        return {
          selector: brokenSelector,
          reasoning: `Healing failed: ${error.message}`,
          confidence: 'none',
        }
      }
    },

    readHealLog() {
      if (!fs.existsSync(HEAL_LOG_PATH)) return []
      try {
        return JSON.parse(fs.readFileSync(HEAL_LOG_PATH, 'utf8'))
      } catch {
        return []
      }
    },

    clearHealLog() {
      if (fs.existsSync(HEAL_LOG_PATH)) {
        fs.writeFileSync(HEAL_LOG_PATH, '[]')
      }
      return null
    },
  })
}

module.exports = { healingPlugin }