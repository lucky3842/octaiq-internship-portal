import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  dangerouslyAllowBrowser: true
})

export { openai }
