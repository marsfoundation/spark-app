import { daiLikeReserve, testAddresses, wethLikeReserve } from '@/test/integration/constants'
import { zeroAddress } from 'viem'
import { CheckedAddress } from '../types/CheckedAddress'
import { assertNativeWithdraw } from './assertNativeWithdraw'

describe(assertNativeWithdraw.name, () => {
  const bob = testAddresses.bob
  const alice = CheckedAddress(testAddresses.alice)
  const reserveAddresses = [daiLikeReserve.token.address, wethLikeReserve.token.address]

  describe('withdraw mode', () => {
    test('throws when receiver is defined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'withdraw', owner: bob, receiver: alice })
      }).toThrow('Receiver address should not be defined when withdrawing')
    })

    test('throws when reserve addresses are defined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'withdraw', owner: bob, reserveAddresses })
      }).toThrow('Reserve addresses should not be defined when withdrawing')
    })

    test('does not throw when receiver and reserve addresses are not defined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'withdraw', owner: bob })
      }).not.toThrow()
    })

    test('does not throw when owner is not defined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'withdraw', owner: undefined })
      }).not.toThrow()
    })
  })

  describe('send mode', () => {
    test('throws when receiver is zero address', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'send', reserveAddresses, owner: bob, receiver: CheckedAddress(zeroAddress) })
      }).toThrow('Receiver address is zero address')
    })

    test('throws when receiver address is reserve address', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'send', reserveAddresses, owner: bob, receiver: daiLikeReserve.token.address })
      }).toThrow('Receiver address is a token address')
    })

    test('throws when receiver address is same as owner address', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'send', reserveAddresses, owner: bob, receiver: bob })
      }).toThrow('Receiver address is the same as the sender')
    })

    test('throws when reserve addresses are undefined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'send', owner: bob, receiver: alice })
      }).toThrow('Reserve addresses should be defined when sending')
    })

    test('does not throw when receiver is not defined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'send', reserveAddresses, owner: bob, receiver: undefined })
      }).not.toThrow()
    })

    test('does not throw when owner is not defined', () => {
      expect(() => {
        assertNativeWithdraw({ mode: 'send', reserveAddresses, owner: undefined, receiver: alice })
      }).not.toThrow()
    })
  })
})
