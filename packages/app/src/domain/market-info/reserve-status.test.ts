import { getMockAaveUserReserve } from '@/test/integration/constants'

import {
  getBorrowEligibilityStatus,
  getCollateralEligibilityStatus,
  getReserveStatus,
  getSupplyAvailabilityStatus,
} from './reserve-status'

describe(getReserveStatus.name, () => {
  test('returns paused when reserve is paused', () => {
    const reserve = getMockAaveUserReserve({ isPaused: true })
    expect(getReserveStatus(reserve)).toBe('paused')
  })

  test('returns frozen when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isFrozen: true })
    expect(getReserveStatus(reserve)).toBe('frozen')
  })

  test('returns active when reserve is active', () => {
    const reserve = getMockAaveUserReserve({ isActive: true })
    expect(getReserveStatus(reserve)).toBe('active')
  })

  test('returns not-active when reserve is neither paused, frozen, nor active', () => {
    const reserve = getMockAaveUserReserve({ isPaused: false, isFrozen: false, isActive: false })
    expect(getReserveStatus(reserve)).toBe('not-active')
  })
})

describe(getSupplyAvailabilityStatus.name, () => {
  test('returns no when reserve is not active', () => {
    const reserve = getMockAaveUserReserve({ isActive: false, supplyCap: '100', totalLiquidity: '50' })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('no')
  })

  test('returns no when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, isFrozen: true })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('no')
  })

  test('returns supply-cap-reached when supply cap is reached', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, supplyCap: '100', totalLiquidity: '100' })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('supply-cap-reached')
  })

  test('returns yes when supply is available', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, supplyCap: '200', totalLiquidity: '100' })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('yes')
  })
})

describe(getCollateralEligibilityStatus.name, () => {
  test('returns no when reserve is not active', () => {
    const reserve = getMockAaveUserReserve({ isActive: false })
    expect(getCollateralEligibilityStatus(reserve)).toBe('no')
  })

  test('returns no when baseLTVasCollateral is 0', () => {
    const reserve = getMockAaveUserReserve({ baseLTVasCollateral: '0' })
    expect(getCollateralEligibilityStatus(reserve)).toBe('no')
  })

  test('returns no when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, isFrozen: true })
    expect(getCollateralEligibilityStatus(reserve)).toBe('no')
  })

  test('returns only-in-isolation-mode when reserve is in isolation mode', () => {
    const reserve = getMockAaveUserReserve({ isIsolated: true })
    expect(getCollateralEligibilityStatus(reserve)).toBe('only-in-isolation-mode')
  })

  test('returns yes when collateral is eligible', () => {
    const reserve = getMockAaveUserReserve()
    expect(getCollateralEligibilityStatus(reserve)).toBe('yes')
  })
})

describe(getBorrowEligibilityStatus.name, () => {
  test('returns no when reserve is not active', () => {
    const reserve = getMockAaveUserReserve({ isActive: false })
    expect(getBorrowEligibilityStatus(reserve)).toBe('no')
  })

  test('returns no when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, isFrozen: true })
    expect(getBorrowEligibilityStatus(reserve)).toBe('no')
  })

  test('returns no when borrowing is not enabled on reserve', () => {
    const reserve = getMockAaveUserReserve({ borrowingEnabled: false })
    expect(getBorrowEligibilityStatus(reserve)).toBe('no')
  })

  test('returns borrow-cap-reached when borrow cap is reached', () => {
    const reserve = getMockAaveUserReserve({ borrowCap: '100', totalDebt: '100' })
    expect(getBorrowEligibilityStatus(reserve)).toBe('borrow-cap-reached')
  })

  test('returns only-in-siloed-mode when reserve is in siloed borrowing mode', () => {
    const reserve = getMockAaveUserReserve({ isSiloedBorrowing: true })
    expect(getBorrowEligibilityStatus(reserve)).toBe('only-in-siloed-mode')
  })

  test('returns yes when borrowing is eligible', () => {
    const reserve = getMockAaveUserReserve()
    expect(getBorrowEligibilityStatus(reserve)).toBe('yes')
  })

  test('returns yes when no borrow cap', () => {
    const reserve = getMockAaveUserReserve({ borrowCap: '0', totalDebt: '100' })
    expect(getBorrowEligibilityStatus(reserve)).toBe('yes')
  })
})
