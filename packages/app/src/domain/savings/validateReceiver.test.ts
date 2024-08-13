import { testAddresses } from '@/test/integration/constants'
import { zeroAddress } from 'viem'
import { validateReceiver } from './validateReceiver'

const account = testAddresses.alice
const receiver = testAddresses.bob
const tokenAddresses = [testAddresses.token, testAddresses.token2]

describe(validateReceiver.name, () => {
  test('return undefined when account is not provided', () => {
    expect(validateReceiver({ account: undefined, tokenAddresses, receiver })).toBe(undefined)
  })

  test('validate that receiver is defined', () => {
    expect(validateReceiver({ account, tokenAddresses, receiver: undefined })).toBe('undefined-receiver')
  })

  test('validate that receiver is not empty string', () => {
    expect(validateReceiver({ account, tokenAddresses, receiver: '' })).toBe('undefined-receiver')
  })

  test('validate that receiver is a valid address', () => {
    const invalidAddresses = [
      '0x0',
      'not-an-address',
      '0x0x0',
      '0XD8DA6BF26964AF9D7EED9E03E53415D37AA96045', // uppercase
    ]
    const validAddresses = [
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // proper checksum
      '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // lowercase
    ]

    for (const address of invalidAddresses)
      expect(validateReceiver({ account, tokenAddresses, receiver: address })).toBe('invalid-address')

    for (const address of validAddresses) {
      expect(validateReceiver({ account, tokenAddresses, receiver: address })).toBe(undefined)
    }
  })

  test('validate that receiver is not zero address', () =>
    expect(validateReceiver({ account, tokenAddresses, receiver: zeroAddress })).toBe('zero-address'))

  test('validate that receiver is not a reserve address', () => {
    const receiver = testAddresses.token
    const tokenAddresses = [receiver, testAddresses.token2]
    expect(validateReceiver({ account, tokenAddresses, receiver })).toBe('token-address')
  })

  test('validate that receiver is not the same as the sender', () =>
    expect(validateReceiver({ account, tokenAddresses, receiver: account })).toBe('self-address'))
})
