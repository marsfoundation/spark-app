export const weEthOracleAbi = [
  {
    inputs: [],
    name: 'weeth',
    outputs: [{ internalType: 'contract IWrappedEtherfiRestakedEth', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const weEthRatioAbi = [
  {
    inputs: [],
    name: 'getRate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const rEthOracleAbi = [
  {
    inputs: [],
    name: 'reth',
    outputs: [{ internalType: 'contract IRocketPoolStakedEth', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const rEthRatioAbi = [
  {
    inputs: [],
    name: 'getExchangeRate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const wstEthOracleAbi = [
  {
    inputs: [],
    name: 'steth',
    outputs: [{ internalType: 'contract ILidoStakedEth', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const wstEthRatioAbi = [
  {
    constant: true,
    inputs: [{ name: '_sharesAmount', type: 'uint256' }],
    name: 'getPooledEthByShares',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const
