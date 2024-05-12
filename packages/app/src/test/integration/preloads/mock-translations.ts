import { mock } from 'bun:test'

await mock.module('../../../locales/en.po', () => {
  return { messages: {} }
})
