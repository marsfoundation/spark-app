import { expect } from 'earl'
import { solidFetch } from './solidFetch.js'

describe(solidFetch.name, () => {
  it('does not hang indefinitely', async () => {
    const sampleUrl = 'http://localhost:1/notExistingPath'

    await expect(solidFetch(sampleUrl)).toBeRejectedWith(TypeError)
  })
})
