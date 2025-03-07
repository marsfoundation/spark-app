/* eslint-disable */
import { MockObject, expect, formatCompact, mockFn } from 'earl'

import { LogFormatterJson } from './LogFormatterJson.js'
import { LogFormatterPretty } from './LogFormatterPretty.js'
import { Logger } from './Logger.js'
import { LogEntry, LoggerTransport } from './types.js'

describe(Logger.name, () => {
  it('calls correct transport', () => {
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterJson(),
        },
      ],
      logLevel: 'TRACE',
    })

    logger.trace('foo')
    logger.debug('foo')
    expect(transport.debug).toHaveBeenCalledTimes(2)

    logger.info('foo')
    expect(transport.log).toHaveBeenCalledTimes(1)

    logger.warn('foo')
    expect(transport.warn).toHaveBeenCalledTimes(1)

    logger.error('foo')
    logger.critical('foo')
    expect(transport.error).toHaveBeenCalledTimes(2)
  })

  it('supports bigint values in json output', () => {
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterJson(),
        },
      ],
      logLevel: 'TRACE',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    expect(transport.log).toHaveBeenOnlyCalledWith(
      JSON.stringify({
        time: '1970-01-01T00:00:00.000Z',
        level: 'INFO',
        parameters: {
          foo: '123',
          bar: ['4', '56'],
        },
      }),
    )
  })

  describe(Logger.prototype.for.name, () => {
    function setup() {
      const transport = createTestTransport()
      const baseLogger = new Logger({
        transports: [
          {
            transport: transport,
            formatter: new LogFormatterJson(),
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

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '{"time":"1970-01-01T00:00:00.000Z","level":"INFO","service":"FooService","message":"hello"}',
      )
    })

    it('single service (object)', () => {
      const { transport, baseLogger } = setup()

      class FooService {}
      const instance = new FooService()
      const logger = baseLogger.for(instance)
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '{"time":"1970-01-01T00:00:00.000Z","level":"INFO","service":"FooService","message":"hello"}',
      )
    })

    it('service with member', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.for('FooService').for('queue')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '{"time":"1970-01-01T00:00:00.000Z","level":"INFO","service":"FooService.queue","message":"hello"}',
      )
    })

    it('service with tag', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '{"time":"1970-01-01T00:00:00.000Z","level":"INFO","service":"FooService:Red","message":"hello"}',
      )
    })

    it('service with tag and member', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService').for('queue')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '{"time":"1970-01-01T00:00:00.000Z","level":"INFO","service":"FooService.queue:Red","message":"hello"}',
      )
    })

    it('lone tag', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag('Red')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '{"time":"1970-01-01T00:00:00.000Z","level":"INFO","service":":Red","message":"hello"}',
      )
    })
  })

  describe(`with ${LogFormatterPretty.name}`, () => {
    it('supports bigint values', () => {
      const { transport, baseLogger } = setup()

      baseLogger.info({ foo: 123n, bar: [4n, 56n] })
      const expectedOutput = [
        '00:00:00.000Z INFO',
        '{',
        '    "foo": "123",',
        '    "bar": [',
        '        "4",',
        '        "56"',
        '    ]',
        '}',
      ].join('\n')
      expect(transport.log).toHaveBeenOnlyCalledWith(expectedOutput)
    })

    it('marks promised values', () => {
      const { transport, baseLogger } = setup()

      baseLogger.info({ test: Promise.resolve(1234) })
      const expectedOutput = ['00:00:00.000Z INFO', '{', '    "test": "Promise"', '}'].join('\n')
      expect(transport.log).toHaveBeenOnlyCalledWith(expectedOutput)
    })

    describe(Logger.prototype.for.name, () => {
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

  describe('error reporting', () => {
    const oldConsoleError = console.error
    beforeEach(() => {
      console.error = () => {}
    })
    afterEach(() => {
      console.error = oldConsoleError
    })

    it('reports error and critical error', () => {
      const mockReportError = mockFn((_: unknown) => {})
      const logger = new Logger({
        reportError: mockReportError,
      })

      logger.error('foo')
      logger.critical('bar')

      expect(mockReportError).toHaveBeenNthCalledWith(1, {
        level: 'ERROR',
        time: expect.a(Date),
        service: undefined,
        message: 'foo',
        parameters: undefined,
        error: undefined,
        resolvedError: undefined,
      })
      expect(mockReportError).toHaveBeenNthCalledWith(2, {
        level: 'CRITICAL',
        time: expect.a(Date),
        service: undefined,
        message: 'bar',
        parameters: undefined,
        error: undefined,
        resolvedError: undefined,
      })
    })

    describe('usage patterns', () => {
      const patterns: [unknown[], LogEntry][] = [
        [
          ['message'],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'message',
            parameters: undefined,
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [new Error('message')],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: undefined,
            parameters: undefined,
            error: new Error('message'),
            resolvedError: {
              name: 'Error',
              error: 'message',
              stack: expect.a(Array),
            },
          },
        ],
        [
          ['foo', new Error('bar')],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'foo',
            parameters: undefined,
            error: new Error('bar'),
            resolvedError: {
              name: 'Error',
              error: 'bar',
              stack: expect.a(Array),
            },
          },
        ],
        [
          [{ x: 1, y: 2 }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: undefined,
            parameters: { x: 1, y: 2 },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          ['message', { x: 1, y: 2 }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'message',
            parameters: { x: 1, y: 2 },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [{ x: 1, y: 2, message: 'message' }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'message',
            parameters: { x: 1, y: 2 },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [{ x: 1, y: 2, message: true }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: undefined,
            parameters: { x: 1, y: 2, message: true },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [new Error('foo'), 'bar', { x: 1, y: 2 }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'bar',
            parameters: { x: 1, y: 2 },
            error: new Error('foo'),
            resolvedError: {
              name: 'Error',
              error: 'foo',
              stack: expect.a(Array),
            },
          },
        ],
      ]

      for (const [args, expected] of patterns) {
        it(`supports ${formatCompact(args, 60)}`, () => {
          const mockReportError = mockFn((_: unknown) => {})
          const logger = new Logger({ reportError: mockReportError })

          logger.error(...args)
          expect(mockReportError).toHaveBeenOnlyCalledWith(expected)
        })
      }
    })
  })
})

function setup(): { transport: TestTransport; baseLogger: Logger } {
  const transport = createTestTransport()
  const baseLogger = new Logger({
    transports: [
      {
        transport,
        formatter: new LogFormatterPretty({ colors: false, utc: true }),
      },
    ],
    logLevel: 'TRACE',
    getTime: () => new Date(0),
    utc: true,
  })
  return { transport, baseLogger }
}

type TestTransport = MockObject<LoggerTransport>
function createTestTransport(): TestTransport {
  return {
    debug: mockFn((_: string | object) => {}),
    log: mockFn((_: string | object) => {}),
    warn: mockFn((_: string | object) => {}),
    error: mockFn((_: string | object) => {}),
  }
}
