import { Logger } from '@marsfoundation/common-universal/logger'
import { expect, mockFn } from 'earl'
import { LogFormatterPretty } from './LogFormatterPretty.js'
import { PrettyLogger } from './PrettyLogger.js'

describe(PrettyLogger.name, () => {
  it('supports bigint values in pretty output', () => {
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterPretty({ colors: false, utc: true }),
        },
      ],
      logLevel: 'TRACE',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    const lines = ['00:00:00.000Z INFO\n', "    { foo: '123', bar: [ '4', '56' ] }", '']
    expect(transport.log).toHaveBeenOnlyCalledWith(lines.join(''))
  })

  it('marks promised values in pretty output', () => {
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterPretty({ colors: false, utc: true }),
        },
      ],
      logLevel: 'TRACE',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ test: Promise.resolve(1234) })
    const lines = ['00:00:00.000Z INFO\n', "    { test: 'Promise' }", '']
    expect(transport.log).toHaveBeenOnlyCalledWith(lines.join(''))
  })

  describe(PrettyLogger.prototype.for.name, () => {
    function setup() {
      const transport = createTestTransport()
      const baseLogger = new Logger({
        transports: [
          {
            transport: transport,
            formatter: new LogFormatterPretty({ colors: false, utc: true }),
          },
        ],
        logLevel: 'TRACE',
        getTime: () => new Date(0),
        utc: true,
      })
      return { transport, baseLogger }
    }

    it('single service (string)', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.for('FooService')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith('00:00:00.000Z INFO [ FooService ] hello')
    })

    it('single service (object)', () => {
      const { transport, baseLogger } = setup()

      class FooService {}
      const instance = new FooService()
      const logger = baseLogger.for(instance)
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith('00:00:00.000Z INFO [ FooService ] hello')
    })

    it('service with member', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.for('FooService').for('queue')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith('00:00:00.000Z INFO [ FooService.queue ] hello')
    })

    it('service with tag', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith('00:00:00.000Z INFO [ FooService:Red ] hello')
    })

    it('service with tag and member', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService').for('queue')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith('00:00:00.000Z INFO [ FooService.queue:Red ] hello')
    })

    it('lone tag', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag('Red')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith('00:00:00.000Z INFO [ :Red ] hello')
    })
  })
})

function createTestTransport() {
  return {
    debug: mockFn((_: string): void => {}),
    log: mockFn((_: string): void => {}),
    warn: mockFn((_: string): void => {}),
    error: mockFn((_: string): void => {}),
  }
}
