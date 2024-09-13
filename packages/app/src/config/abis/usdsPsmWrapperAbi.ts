export const usdsPsmWrapperAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'psm_', type: 'address', internalType: 'address' },
      { name: 'usdsJoin_', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'HALTED',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'buf',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'buyGem',
    inputs: [
      { name: 'usr', type: 'address', internalType: 'address' },
      { name: 'gemAmt', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: 'usdsInWad', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'dai',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'dec',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gem',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract GemLike' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'gemJoin',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ilk',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'live',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pocket',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'psm',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract PsmLike' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'sellGem',
    inputs: [
      { name: 'usr', type: 'address', internalType: 'address' },
      { name: 'gemAmt', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: 'usdsOutWad', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'tin',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'to18ConversionFactor',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tout',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'usds',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract GemLike' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'usdsJoin',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract UsdsJoinLike' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vat',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract VatLike' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vow',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
]