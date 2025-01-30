import { expect } from 'earl'
import { UnixTime } from './UnixTime.js'

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

  describe(UnixTime.formatSpan.name, () => {
    it('formats a span', () => {
      expect(UnixTime.formatSpan(UnixTime.ONE_SECOND())).toEqual('1s')
      expect(UnixTime.formatSpan(UnixTime.ONE_MINUTE())).toEqual('1m')
      expect(UnixTime.formatSpan(UnixTime.ONE_DAY())).toEqual('1d')
      expect(UnixTime.formatSpan(UnixTime.SEVEN_DAYS())).toEqual('7d')
      expect(UnixTime.formatSpan(UnixTime.ONE_MONTH())).toEqual('30d')
      expect(UnixTime.formatSpan(UnixTime.ONE_YEAR())).toEqual('365d')
      expect(UnixTime.formatSpan(UnixTime(UnixTime.ONE_YEAR() - UnixTime.SEVEN_DAYS()))).toEqual('358d')
      expect(UnixTime.formatSpan(UnixTime(UnixTime.ONE_YEAR() - UnixTime.ONE_HOUR()))).toEqual('365d')
    })
  })
})
