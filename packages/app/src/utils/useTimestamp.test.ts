import { act, waitFor } from '@testing-library/react'

import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { vi } from 'vitest'
import { useTimestamp } from './useTimestamp'

const hookRenderer = setupHookRenderer({
  hook: useTimestamp,
  handlers: [],
  args: {},
})

describe('useTimestamp', () => {
  it('should return the current timestamp', async () => {
    const { result } = hookRenderer()

    expect(result.current.timestamp).toBeGreaterThan(0)
  })

  it('should return the current timestamp in milliseconds', async () => {
    const { result } = hookRenderer()

    expect(result.current.timestampInMs).toBeGreaterThan(0)
  })

  it('should not change the timestamp during the component lifecycle', async () => {
    const { result, rerender } = hookRenderer()

    await waitFor(() => expect(result.current).toBeDefined())
    const { timestampInMs: initialTimestampInMs, timestamp: initialTimestamp } = result.current

    act(() => {
      rerender()
    })

    await waitFor(() => {
      expect(result.current.timestampInMs).toBe(initialTimestampInMs)
      expect(result.current.timestamp).toBe(initialTimestamp)
    })
  })

  it('should update the timestamp after the specified refresh interval', async () => {
    vi.useFakeTimers()

    const refreshIntervalInMs = 10
    const { result } = hookRenderer({ args: { refreshIntervalInMs } })
    const { timestampInMs: initialTimestampInMs, timestamp: initialTimestamp } = result.current

    await vi.advanceTimersByTimeAsync(2_000)

    expect(result.current.timestampInMs).toBeGreaterThan(initialTimestampInMs)
    expect(result.current.timestamp).toBeGreaterThan(initialTimestamp)

    vi.restoreAllMocks()
  })
})
