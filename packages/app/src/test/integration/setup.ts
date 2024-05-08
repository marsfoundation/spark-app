import './setupTestEnvironmentCompatibility' // This MUST be the first import
import './mocks/install-mocks'

import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect, vitest } from 'vitest'

import { queryClient } from './query-client'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(async () => {
  await queryClient.resetQueries()
  cleanup()
  // Resets BrowserRouter state
  // Generally speaking, MemoryRouter should be preferred in tests but if BrowserRouter is used accidentally, this cleanup line can save lots of debugging time
  window.history.pushState({}, '', '/')
})

// mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vitest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vitest.fn(), // deprecated
    removeListener: vitest.fn(), // deprecated
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
    dispatchEvent: vitest.fn(),
  })),
})

// sometimes it's useful to increase the timeout for async tests
// configure({ asyncUtilTimeout: 60_000 })
