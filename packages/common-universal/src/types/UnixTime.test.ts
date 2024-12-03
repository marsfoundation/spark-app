import { expect } from 'earl'
import { UnixTime } from './UnixTime'

describe(UnixTime.name, () => {
  it('works with valid unix timestamps', () => {
    const time = UnixTime(1672531200)

    expect(time).toEqual(1672531200n as UnixTime)
  })

  it('works with valid time duration', () => {
    const time = UnixTime(5)

    expect(time).toEqual(5n as UnixTime)
  })

  it('throws when passed a negative value', () => {
    expect(() => UnixTime(-1)).toThrow('Value should be greater than or equal to 0.')
  })

  it('throws when accidentally pass timestamp in ms', () => {
    const timestampInMs = Date.now()

    expect(() => UnixTime(timestampInMs)).toThrow(
      'Value should be less than or equal to 3000-01-01T00:00:00.000Z. Probably you passed milliseconds instead of seconds.',
    )
  })

  describe(UnixTime.fromDate.name, () => {
    it('works with a valid date', () => {
      const date = new Date('2023-01-01T00:00:00.000Z')
      const time = UnixTime.fromDate(date)

      expect(time).toEqual(1672531200n as UnixTime)
    })
  })

  describe(UnixTime.toDate.name, () => {
    it('works with a valid date', () => {
      const date = new Date('2023-01-01T00:00:00.000Z')

      const time = UnixTime.toDate(UnixTime.fromDate(date))

      expect(time).toEqual(date)
    })
  })
})
