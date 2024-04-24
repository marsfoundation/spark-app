import { getMockAaveUserReserve } from '@/test/integration/constants'

import {
  getBorrowEligibilityStatus,
  getCollateralEligibilityStatus,
  getReserveStatus,
  getSupplyAvailabilityStatus,
} from './reserve-status'

describe(getReserveStatus.name, () => {
  it('returns paused when reserve is paused', () => {
    const reserve = getMockAaveUserReserve({ isPaused: true })
    expect(getReserveStatus(reserve)).toBe('paused')
  })

  it('returns frozen when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isFrozen: true })
    expect(getReserveStatus(reserve)).toBe('frozen')
  })

  it('returns active when reserve is active', () => {
    const reserve = getMockAaveUserReserve({ isActive: true })
    expect(getReserveStatus(reserve)).toBe('active')
  })

  it('returns not-active when reserve is neither paused, frozen, nor active', () => {
    const reserve = getMockAaveUserReserve({ isPaused: false, isFrozen: false, isActive: false })
    expect(getReserveStatus(reserve)).toBe('not-active')
  })
})

describe(getSupplyAvailabilityStatus.name, () => {
  it('returns no when reserve is not active', () => {
    const reserve = getMockAaveUserReserve({ isActive: false, supplyCap: '100', totalLiquidity: '50' })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('no')
  })

  it('returns no when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, isFrozen: true })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('no')
  })

  it('returns supply-cap-reached when supply cap is reached', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, supplyCap: '100', totalLiquidity: '100' })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('supply-cap-reached')
  })

  it('returns yes when supply is available', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, supplyCap: '200', totalLiquidity: '100' })
    expect(getSupplyAvailabilityStatus(reserve)).toBe('yes')
  })
})

describe(getCollateralEligibilityStatus.name, () => {
  it('returns no when reserve is not active', () => {
    const reserve = getMockAaveUserReserve({ isActive: false })
    expect(getCollateralEligibilityStatus(reserve)).toBe('no')
  })

  it('returns no when baseLTVasCollateral is 0', () => {
    const reserve = getMockAaveUserReserve({ baseLTVasCollateral: '0' })
    expect(getCollateralEligibilityStatus(reserve)).toBe('no')
  })

  it('returns no when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, isFrozen: true })
    expect(getCollateralEligibilityStatus(reserve)).toBe('no')
  })

  it('returns only-in-isolation-mode when reserve is in isolation mode', () => {
    const reserve = getMockAaveUserReserve({ isIsolated: true })
    expect(getCollateralEligibilityStatus(reserve)).toBe('only-in-isolation-mode')
  })

  it('returns yes when collateral is eligible', () => {
    const reserve = getMockAaveUserReserve()
    expect(getCollateralEligibilityStatus(reserve)).toBe('yes')
  })
})

describe(getBorrowEligibilityStatus.name, () => {
  it('returns no when reserve is not active', () => {
    const reserve = getMockAaveUserReserve({ isActive: false })
    expect(getBorrowEligibilityStatus(reserve)).toBe('no')
  })

  it('returns no when reserve is frozen', () => {
    const reserve = getMockAaveUserReserve({ isActive: true, isFrozen: true })
    expect(getBorrowEligibilityStatus(reserve)).toBe('no')
  })

  it('returns no when borrowing is not enabled on reserve', () => {
    const reserve = getMockAaveUserReserve({ borrowingEnabled: false })
    expect(getBorrowEligibilityStatus(reserve)).toBe('no')
  })

  it('returns borrow-cap-reached when borrow cap is reached', () => {
    const reserve = getMockAaveUserReserve({ borrowCap: '100', totalDebt: '100' })
    expect(getBorrowEligibilityStatus(reserve)).toBe('borrow-cap-reached')
  })

  it('returns only-in-siloed-mode when reserve is in siloed borrowing mode', () => {
    const reserve = getMockAaveUserReserve({ isSiloedBorrowing: true })
    expect(getBorrowEligibilityStatus(reserve)).toBe('only-in-siloed-mode')
  })

  it('returns yes when borrowing is eligible', () => {
    const reserve = getMockAaveUserReserve()
    expect(getBorrowEligibilityStatus(reserve)).toBe('yes')
  })

  it('returns yes when no borrow cap', () => {
    const reserve = getMockAaveUserReserve({ borrowCap: '0', totalDebt: '100' })
    expect(getBorrowEligibilityStatus(reserve)).toBe('yes')
  })
})
