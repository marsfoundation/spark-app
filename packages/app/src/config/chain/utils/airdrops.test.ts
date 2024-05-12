import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { iterateAirdropData } from './airdrops'

describe(iterateAirdropData.name, () => {
  test('works for real config', () => {
    const airdrops = {
      SPK: {
        ETH: {
          deposit: 6_000_000,
        },
        DAI: {
          borrow: 24_000_000,
        },
      },
    } as const

    expect(iterateAirdropData(airdrops, TokenSymbol('ETH'), 'deposit')).toEqual([{ id: 'SPK', amount: 6_000_000 }])
    expect(iterateAirdropData(airdrops, TokenSymbol('DAI'), 'borrow')).toEqual([{ id: 'SPK', amount: 24_000_000 }])
  })
  test('works with both deposit and borrow specified', () => {
    const airdrops = {
      SPK: {
        ETH: {
          deposit: 6_000_000,
          borrow: 7_000_000,
        },
        DAI: {
          deposit: 23_000_000,
          borrow: 24_000_000,
        },
      },
    } as const

    expect(iterateAirdropData(airdrops, TokenSymbol('ETH'), 'deposit')).toEqual([{ id: 'SPK', amount: 6_000_000 }])
    expect(iterateAirdropData(airdrops, TokenSymbol('ETH'), 'borrow')).toEqual([{ id: 'SPK', amount: 7_000_000 }])
    expect(iterateAirdropData(airdrops, TokenSymbol('DAI'), 'deposit')).toEqual([{ id: 'SPK', amount: 23_000_000 }])
    expect(iterateAirdropData(airdrops, TokenSymbol('DAI'), 'borrow')).toEqual([{ id: 'SPK', amount: 24_000_000 }])
  })

  test('works for multiple airdrops', () => {
    const airdrops = {
      SPK: {
        ETH: {
          deposit: 6_000_000,
        },
        DAI: {
          borrow: 24_000_000,
        },
      },
      SPK2: {
        ETH: {
          deposit: 7_000_000,
        },
        DAI: {
          borrow: 25_000_000,
        },
      },
    } as const

    expect(iterateAirdropData(airdrops, TokenSymbol('ETH'), 'deposit')).toEqual([
      { id: 'SPK', amount: 6_000_000 },
      { id: 'SPK2', amount: 7_000_000 },
    ])
    expect(iterateAirdropData(airdrops, TokenSymbol('DAI'), 'borrow')).toEqual([
      { id: 'SPK', amount: 24_000_000 },
      { id: 'SPK2', amount: 25_000_000 },
    ])
  })
})
