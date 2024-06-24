import { SupportedChainId } from './SupportedChainId'

describe(SupportedChainId.name, () => {
  it('works with a supported chain id', () => {
    expect(SupportedChainId(1)).toEqual(1)
    expect(SupportedChainId(100)).toEqual(100)
  })

  it('works with supported chain id passed as a string', () => {
    expect(SupportedChainId('1')).toEqual(1)
    expect(SupportedChainId('100')).toEqual(100)
  })

  it('throws with unsupported chain id', () => {
    expect(() => SupportedChainId(0)).toThrow('Chain id is not supported.')
  })

  it('throws when chain id is negative', () => {
    expect(() => SupportedChainId(-1)).toThrow('Chain id value should be a positive number.')
  })

  it('throws when chain id has decimal points', () => {
    expect(() => SupportedChainId(1.5)).toThrow('Chain id should not have decimal points in its representation.')
  })

  it('throws when chain id is not number like', () => {
    expect(() => SupportedChainId('not-a-number')).toThrow(
      'Value argument: not-a-number cannot be converted to BigNumber.',
    )
  })
})
