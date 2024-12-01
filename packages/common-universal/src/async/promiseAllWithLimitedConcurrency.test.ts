import { expect } from 'earl'
import { sleep } from './async'
import { promiseAllWithLimitedConcurrency } from './promiseAllWithLimitedConcurrency'

import * as FakeTimers from '@sinonjs/fake-timers'

describe(promiseAllWithLimitedConcurrency.name, () => {
  let clock: FakeTimers.InstalledClock
  beforeEach(() => {
    clock = FakeTimers.install()
  })
  afterEach(() => {
    clock.uninstall()
  })

  it('limits concurrency', async () => {
    const resolved: number[] = []
    async function resolve(delay: number, id: number): Promise<number> {
      await sleep(delay)
      resolved.push(id)

      return id
    }

    const fns = [() => resolve(100, 0), () => resolve(200, 1), () => resolve(0, 2), () => resolve(0, 3)]

    const promisedResult = promiseAllWithLimitedConcurrency(fns, { maxConcurrency: 2 })

    await clock.tickAsync(100)
    expect(resolved).toEqual([0])

    await clock.tickAsync(1)
    expect(resolved).toEqual([0, 2])

    await clock.tickAsync(1)
    expect(resolved).toEqual([0, 2, 3])

    await clock.tickAsync(100)
    expect(resolved).toEqual([0, 2, 3, 1])

    expect(await promisedResult).toEqual([0, 1, 2, 3])
  })
})
