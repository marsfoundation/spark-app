import './setupTestEnvironmentCompatibility' // This MUST be the first import
import './mocks/install-mocks'

import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'bun:test'

import { queryClient } from './query-client'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// extends Vitest's expect method with custom matchers
expect.extend({
  toHaveBeenCalledWithURL(mockFetch, expected) {
    const lastCall = mockFetch?.mock?.lastCall
    if (!Array.isArray(lastCall)) {
      return {
        pass: false,
        message: () => 'mock fetch was not called',
      }
    }

    const url = new URL(lastCall[0] as any)
    if (`${url.origin}${url.pathname}` !== expected) {
      return {
        pass: false,
        message: () => `fetch was called with ${url.origin}${url.pathname}, expected ${expected}`,
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },
  toHaveBeenCalledWithURLParams(mockFetch, expected) {
    const lastCall = mockFetch?.mock?.lastCall
    if (!Array.isArray(lastCall)) {
      return {
        pass: false,
        message: () => 'mock fetch was not called',
      }
    }

    const url = new URL(lastCall[0] as any)
    for (const [key, value] of Object.entries(expected)) {
      if (url.searchParams.get(key) !== value) {
        return {
          pass: false,
          message: () => `fetch was called with ${key}=${url.searchParams.get(key)}, expected ${key}=${value}`,
        }
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },
  toHaveBeenCalledWithBodyParams(mockFetch, expected) {
    const lastCall = mockFetch?.mock?.lastCall
    if (!Array.isArray(lastCall)) {
      return {
        pass: false,
        message: () => 'mock fetch was not called',
      }
    }
    if (typeof (lastCall[1] as any)?.body !== 'string') {
      return {
        pass: false,
        message: () => 'mock fetch was not called with a body',
      }
    }
    const body = JSON.parse((lastCall[1] as any)?.body) as any
    for (const [key, value] of Object.entries(expected)) {
      if (body[key] !== value) {
        return {
          pass: false,
          message: () => `fetch was called with ${key}=${body[key]}, expected ${key}=${value}`,
        }
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(async () => {
  await queryClient.resetQueries()
  cleanup()
  // Resets BrowserRouter state
  // Generally speaking, MemoryRouter should be preferred in tests but if BrowserRouter is used accidentally, this cleanup line can save lots of debugging time
  window.history.pushState({}, '', '/')
})

// mock matchMedia
// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: vitest.fn().mockImplementation((query) => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: vitest.fn(), // deprecated
//     removeListener: vitest.fn(), // deprecated
//     addEventListener: vitest.fn(),
//     removeEventListener: vitest.fn(),
//     dispatchEvent: vitest.fn(),
//   })),
// })

// sometimes it's useful to increase the timeout for async tests
// configure({ asyncUtilTimeout: 60_000 })
