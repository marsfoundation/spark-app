import { describe, expect, test, vi } from 'vitest'
import { decodeRevertReason } from './utils'

vi.mock('@/config/aaveContractErrors', () => ({
  aaveContractErrors: {
    '1': 'The caller of the function is not a pool admin',
    '36': 'There is not enough collateral to cover a new borrow',
  },
}))

describe('decodeRevertReason', () => {
  test('should return original message when it does not include "reverted"', () => {
    const errorMessage = 'Some error occurred'
    const result = decodeRevertReason(errorMessage)
    expect(result).toBe(errorMessage)
  })

  test('should return original message when it includes "reverted" but no error code is found', () => {
    const errorMessage = 'Transaction reverted without a specific error code'
    const result = decodeRevertReason(errorMessage)
    expect(result).toBe(errorMessage)
  })

  test('should return mapped error message when a valid error code is found', () => {
    const errorMessage = 'Transaction reverted: execution reverted: 36'
    const result = decodeRevertReason(errorMessage)
    expect(result).toBe('There is not enough collateral to cover a new borrow')
  })

  test('should return original message when error code is not found in aaveContractErrors', () => {
    const errorMessage = 'Transaction reverted: execution reverted: 999'
    const result = decodeRevertReason(errorMessage)
    expect(result).toBe(errorMessage)
  })

  test('should handle complex error messages with multiple numbers', () => {
    const errorMessage = 'Transaction reverted: execution reverted: code 1 with amount 200'
    const result = decodeRevertReason(errorMessage)
    expect(result).toBe('The caller of the function is not a pool admin')
  })

  test('should handle edge case with empty error message', () => {
    const errorMessage = ''
    const result = decodeRevertReason(errorMessage)
    expect(result).toBe('')
  })
})
