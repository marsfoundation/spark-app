//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Chainlog
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F)
 */
export const chainlogAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'usr', internalType: 'address', type: 'address', indexed: false }],
    name: 'Deny',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'usr', internalType: 'address', type: 'address', indexed: false }],
    name: 'Rely',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32', indexed: false }],
    name: 'RemoveAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'addr', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'UpdateAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'ipfs', internalType: 'string', type: 'string', indexed: false }],
    name: 'UpdateIPFS',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'sha256sum', internalType: 'string', type: 'string', indexed: false }],
    name: 'UpdateSha256sum',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'string', type: 'string', indexed: false }],
    name: 'UpdateVersion',
  },
  {
    type: 'function',
    inputs: [],
    name: 'count',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'deny',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'get',
    outputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ipfs',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'keys',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'list',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'rely',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_addr', internalType: 'address', type: 'address' },
    ],
    name: 'setAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ipfs', internalType: 'string', type: 'string' }],
    name: 'setIPFS',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_sha256sum', internalType: 'string', type: 'string' }],
    name: 'setSha256sum',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_version', internalType: 'string', type: 'string' }],
    name: 'setVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sha256sum',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'wards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F)
 */
export const chainlogAddress = {
  1: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
  5: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F)
 */
export const chainlogConfig = { address: chainlogAddress, abi: chainlogAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Collector
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x0D56700c90a690D8795D6C148aCD94b12932f4E3)
 */
export const collectorAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address' }],
    name: 'changeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'logic', internalType: 'address', type: 'address' },
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_logic', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x0D56700c90a690D8795D6C148aCD94b12932f4E3)
 */
export const collectorAddress = {
  1: '0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5',
  5: '0x0D56700c90a690D8795D6C148aCD94b12932f4E3',
  100: '0xb9E6DBFa4De19CCed908BcbFe1d015190678AB5f',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x0D56700c90a690D8795D6C148aCD94b12932f4E3)
 */
export const collectorConfig = { address: collectorAddress, abi: collectorAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Faucet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe2bE5BfdDbA49A86e27f3Dd95710B528D43272C2)
 */
export const faucetAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_makerFaucet', internalType: 'address', type: 'address' },
      { name: '_psm', internalType: 'address', type: 'address' },
      { name: '_sDai', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dai',
    outputs: [{ name: '', internalType: 'contract TokenLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'gem',
    outputs: [{ name: '', internalType: 'contract TokenLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'makerFaucet',
    outputs: [{ name: '', internalType: 'contract MakerFaucetLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'psm',
    outputs: [{ name: '', internalType: 'contract PsmLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sDai',
    outputs: [{ name: '', internalType: 'contract TokenLike', type: 'address' }],
    stateMutability: 'view',
  },
] as const

/**
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe2bE5BfdDbA49A86e27f3Dd95710B528D43272C2)
 */
export const faucetAddress = {
  5: '0xe2bE5BfdDbA49A86e27f3Dd95710B528D43272C2',
} as const

/**
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe2bE5BfdDbA49A86e27f3Dd95710B528D43272C2)
 */
export const faucetConfig = { address: faucetAddress, abi: faucetAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAMAutoLine
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x21DaD87779D9FfA8Ed3E1036cBEA8784cec4fB83)
 */
export const iamAutoLineAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'vat_', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'usr', internalType: 'address', type: 'address', indexed: true }],
    name: 'Deny',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'line', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'lineNew', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Exec',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'usr', internalType: 'address', type: 'address', indexed: true }],
    name: 'Rely',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'ilk', internalType: 'bytes32', type: 'bytes32', indexed: true }],
    name: 'Remove',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'line', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'gap', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'ttl', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Setup',
  },
  {
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'deny',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ilk', internalType: 'bytes32', type: 'bytes32' }],
    name: 'exec',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ilks',
    outputs: [
      { name: 'line', internalType: 'uint256', type: 'uint256' },
      { name: 'gap', internalType: 'uint256', type: 'uint256' },
      { name: 'ttl', internalType: 'uint48', type: 'uint48' },
      { name: 'last', internalType: 'uint48', type: 'uint48' },
      { name: 'lastInc', internalType: 'uint48', type: 'uint48' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'rely',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'ilk', internalType: 'bytes32', type: 'bytes32' }],
    name: 'remIlk',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32' },
      { name: 'line', internalType: 'uint256', type: 'uint256' },
      { name: 'gap', internalType: 'uint256', type: 'uint256' },
      { name: 'ttl', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setIlk',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vat',
    outputs: [{ name: '', internalType: 'contract VatLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'wards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x21DaD87779D9FfA8Ed3E1036cBEA8784cec4fB83)
 */
export const iamAutoLineAddress = {
  1: '0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3',
  5: '0x21DaD87779D9FfA8Ed3E1036cBEA8784cec4fB83',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x21DaD87779D9FfA8Ed3E1036cBEA8784cec4fB83)
 */
export const iamAutoLineConfig = { address: iamAutoLineAddress, abi: iamAutoLineAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LendingPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC13e21B648A5Ee794902342038FF3aDAB66BE987)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d)
 */
export const lendingPoolAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_logic', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC13e21B648A5Ee794902342038FF3aDAB66BE987)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d)
 */
export const lendingPoolAddress = {
  1: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
  5: '0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d',
  100: '0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC13e21B648A5Ee794902342038FF3aDAB66BE987)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d)
 */
export const lendingPoolConfig = { address: lendingPoolAddress, abi: lendingPoolAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LendingPoolAddressProvider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E)
 */
export const lendingPoolAddressProviderAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'marketId', internalType: 'string', type: 'string' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ACLAdminUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ACLManagerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'AddressSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'proxyAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'oldImplementationAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'newImplementationAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'AddressSetAsProxy',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldMarketId', internalType: 'string', type: 'string', indexed: true },
      { name: 'newMarketId', internalType: 'string', type: 'string', indexed: true },
    ],
    name: 'MarketIdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'PoolConfiguratorUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'PoolDataProviderUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'PoolUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'PriceOracleSentinelUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'PriceOracleUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'proxyAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'implementationAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ProxyCreated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getACLAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getACLManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMarketId',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPoolConfigurator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPoolDataProvider',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPriceOracle',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPriceOracleSentinel',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: 'newAclAdmin', internalType: 'address', type: 'address' }],
    name: 'setACLAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newAclManager', internalType: 'address', type: 'address' }],
    name: 'setACLManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newImplementationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setAddressAsProxy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newMarketId', internalType: 'string', type: 'string' }],
    name: 'setMarketId',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPoolConfiguratorImpl', internalType: 'address', type: 'address' }],
    name: 'setPoolConfiguratorImpl',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newDataProvider', internalType: 'address', type: 'address' }],
    name: 'setPoolDataProvider',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPoolImpl', internalType: 'address', type: 'address' }],
    name: 'setPoolImpl',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPriceOracle', internalType: 'address', type: 'address' }],
    name: 'setPriceOracle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPriceOracleSentinel', internalType: 'address', type: 'address' }],
    name: 'setPriceOracleSentinel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E)
 */
export const lendingPoolAddressProviderAddress = {
  1: '0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE',
  5: '0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E',
  100: '0xA98DaCB3fC964A6A0d2ce3B77294241585EAbA6d',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E)
 */
export const lendingPoolAddressProviderConfig = {
  address: lendingPoolAddressProviderAddress,
  abi: lendingPoolAddressProviderAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pot
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x50672F0a14B40051B65958818a7AcA3D54Bd81Af)
 */
export const potAbi = [
  {
    payable: false,
    type: 'constructor',
    inputs: [{ name: 'vat_', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: true,
    inputs: [
      { name: 'sig', internalType: 'bytes4', type: 'bytes4', indexed: true },
      { name: 'usr', internalType: 'address', type: 'address', indexed: true },
      { name: 'arg1', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'arg2', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'LogNote',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'Pie',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'cage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'chi',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'guy', internalType: 'address', type: 'address' }],
    name: 'deny',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'drip',
    outputs: [{ name: 'tmp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'dsr',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'wad', internalType: 'uint256', type: 'uint256' }],
    name: 'exit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'what', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'file',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'what', internalType: 'bytes32', type: 'bytes32' },
      { name: 'addr', internalType: 'address', type: 'address' },
    ],
    name: 'file',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'wad', internalType: 'uint256', type: 'uint256' }],
    name: 'join',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'live',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'pie',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'guy', internalType: 'address', type: 'address' }],
    name: 'rely',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'rho',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'vat',
    outputs: [{ name: '', internalType: 'contract VatLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'vow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'wards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x50672F0a14B40051B65958818a7AcA3D54Bd81Af)
 */
export const potAddress = {
  1: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
  5: '0x50672F0a14B40051B65958818a7AcA3D54Bd81Af',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x50672F0a14B40051B65958818a7AcA3D54Bd81Af)
 */
export const potConfig = { address: potAddress, abi: potAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SavingsDai
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x83f20f44975d03b1b09e64809b757c47f942beea)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c)
 */
export const savingsDaiAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_daiJoin', internalType: 'address', type: 'address' },
      { name: '_pot', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'assets', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'shares', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'receiver', internalType: 'address', type: 'address', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'assets', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'shares', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Withdraw',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dai',
    outputs: [{ name: '', internalType: 'contract DaiLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'daiJoin',
    outputs: [{ name: '', internalType: 'contract DaiJoinLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deploymentChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pot',
    outputs: [{ name: '', internalType: 'contract PotLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vat',
    outputs: [{ name: '', internalType: 'contract VatLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x83f20f44975d03b1b09e64809b757c47f942beea)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c)
 */
export const savingsDaiAddress = {
  1: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
  5: '0xD8134205b0328F5676aaeFb3B2a0DC15f4029d8C',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x83f20f44975d03b1b09e64809b757c47f942beea)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c)
 */
export const savingsDaiConfig = { address: savingsDaiAddress, abi: savingsDaiAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UiIncentiveDataProvider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA7F8A757C4f7696c015B595F51B2901AC0121B18)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1472B7d120ab62D60f60e1D804B3858361c3C475)
 */
export const uiIncentiveDataProviderAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'contract IPoolAddressesProvider', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getFullReservesIncentiveData',
    outputs: [
      {
        name: '',
        internalType: 'struct IUiIncentiveDataProviderV3.AggregatedReserveIncentiveData[]',
        type: 'tuple[]',
        components: [
          { name: 'underlyingAsset', internalType: 'address', type: 'address' },
          {
            name: 'aIncentiveData',
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'rewardsTokenInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'emissionPerSecond', internalType: 'uint256', type: 'uint256' },
                  { name: 'incentivesLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'emissionEndTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'precision', internalType: 'uint8', type: 'uint8' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'vIncentiveData',
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'rewardsTokenInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'emissionPerSecond', internalType: 'uint256', type: 'uint256' },
                  { name: 'incentivesLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'emissionEndTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'precision', internalType: 'uint8', type: 'uint8' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'sIncentiveData',
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'rewardsTokenInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'emissionPerSecond', internalType: 'uint256', type: 'uint256' },
                  { name: 'incentivesLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'emissionEndTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'precision', internalType: 'uint8', type: 'uint8' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: '',
        internalType: 'struct IUiIncentiveDataProviderV3.UserReserveIncentiveData[]',
        type: 'tuple[]',
        components: [
          { name: 'underlyingAsset', internalType: 'address', type: 'address' },
          {
            name: 'aTokenIncentivesUserData',
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'userRewardsInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'userUnclaimedRewards', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesUserIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'vTokenIncentivesUserData',
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'userRewardsInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'userUnclaimedRewards', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesUserIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'sTokenIncentivesUserData',
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'userRewardsInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'userUnclaimedRewards', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesUserIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'contract IPoolAddressesProvider', type: 'address' }],
    name: 'getReservesIncentivesData',
    outputs: [
      {
        name: '',
        internalType: 'struct IUiIncentiveDataProviderV3.AggregatedReserveIncentiveData[]',
        type: 'tuple[]',
        components: [
          { name: 'underlyingAsset', internalType: 'address', type: 'address' },
          {
            name: 'aIncentiveData',
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'rewardsTokenInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'emissionPerSecond', internalType: 'uint256', type: 'uint256' },
                  { name: 'incentivesLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'emissionEndTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'precision', internalType: 'uint8', type: 'uint8' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'vIncentiveData',
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'rewardsTokenInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'emissionPerSecond', internalType: 'uint256', type: 'uint256' },
                  { name: 'incentivesLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'emissionEndTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'precision', internalType: 'uint8', type: 'uint8' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'sIncentiveData',
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'rewardsTokenInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'emissionPerSecond', internalType: 'uint256', type: 'uint256' },
                  { name: 'incentivesLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'emissionEndTimestamp', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'precision', internalType: 'uint8', type: 'uint8' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'contract IPoolAddressesProvider', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserReservesIncentivesData',
    outputs: [
      {
        name: '',
        internalType: 'struct IUiIncentiveDataProviderV3.UserReserveIncentiveData[]',
        type: 'tuple[]',
        components: [
          { name: 'underlyingAsset', internalType: 'address', type: 'address' },
          {
            name: 'aTokenIncentivesUserData',
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'userRewardsInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'userUnclaimedRewards', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesUserIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'vTokenIncentivesUserData',
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'userRewardsInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'userUnclaimedRewards', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesUserIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
          {
            name: 'sTokenIncentivesUserData',
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            type: 'tuple',
            components: [
              { name: 'tokenAddress', internalType: 'address', type: 'address' },
              { name: 'incentiveControllerAddress', internalType: 'address', type: 'address' },
              {
                name: 'userRewardsInformation',
                internalType: 'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                type: 'tuple[]',
                components: [
                  { name: 'rewardTokenSymbol', internalType: 'string', type: 'string' },
                  { name: 'rewardOracleAddress', internalType: 'address', type: 'address' },
                  { name: 'rewardTokenAddress', internalType: 'address', type: 'address' },
                  { name: 'userUnclaimedRewards', internalType: 'uint256', type: 'uint256' },
                  { name: 'tokenIncentivesUserIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'rewardPriceFeed', internalType: 'int256', type: 'int256' },
                  { name: 'priceFeedDecimals', internalType: 'uint8', type: 'uint8' },
                  { name: 'rewardTokenDecimals', internalType: 'uint8', type: 'uint8' },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA7F8A757C4f7696c015B595F51B2901AC0121B18)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1472B7d120ab62D60f60e1D804B3858361c3C475)
 */
export const uiIncentiveDataProviderAddress = {
  1: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
  5: '0x1472B7d120ab62D60f60e1D804B3858361c3C475',
  100: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA7F8A757C4f7696c015B595F51B2901AC0121B18)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1472B7d120ab62D60f60e1D804B3858361c3C475)
 */
export const uiIncentiveDataProviderConfig = {
  address: uiIncentiveDataProviderAddress,
  abi: uiIncentiveDataProviderAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UiPoolDataProvider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x36eddc380C7f370e5f05Da5Bd7F970a27f063e39)
 */
export const uiPoolDataProviderAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_networkBaseTokenPriceInUsdProxyAggregator',
        internalType: 'contract IEACAggregatorProxy',
        type: 'address',
      },
      {
        name: '_marketReferenceCurrencyPriceInUsdProxyAggregator',
        internalType: 'contract IEACAggregatorProxy',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ETH_CURRENCY_UNIT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MKR_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_bytes32', internalType: 'bytes32', type: 'bytes32' }],
    name: 'bytes32ToString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'contract IPoolAddressesProvider', type: 'address' }],
    name: 'getReservesData',
    outputs: [
      {
        name: '',
        internalType: 'struct IUiPoolDataProviderV3.AggregatedReserveData[]',
        type: 'tuple[]',
        components: [
          { name: 'underlyingAsset', internalType: 'address', type: 'address' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'decimals', internalType: 'uint256', type: 'uint256' },
          { name: 'baseLTVasCollateral', internalType: 'uint256', type: 'uint256' },
          { name: 'reserveLiquidationThreshold', internalType: 'uint256', type: 'uint256' },
          { name: 'reserveLiquidationBonus', internalType: 'uint256', type: 'uint256' },
          { name: 'reserveFactor', internalType: 'uint256', type: 'uint256' },
          { name: 'usageAsCollateralEnabled', internalType: 'bool', type: 'bool' },
          { name: 'borrowingEnabled', internalType: 'bool', type: 'bool' },
          { name: 'stableBorrowRateEnabled', internalType: 'bool', type: 'bool' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          { name: 'isFrozen', internalType: 'bool', type: 'bool' },
          { name: 'liquidityIndex', internalType: 'uint128', type: 'uint128' },
          { name: 'variableBorrowIndex', internalType: 'uint128', type: 'uint128' },
          { name: 'liquidityRate', internalType: 'uint128', type: 'uint128' },
          { name: 'variableBorrowRate', internalType: 'uint128', type: 'uint128' },
          { name: 'stableBorrowRate', internalType: 'uint128', type: 'uint128' },
          { name: 'lastUpdateTimestamp', internalType: 'uint40', type: 'uint40' },
          { name: 'aTokenAddress', internalType: 'address', type: 'address' },
          { name: 'stableDebtTokenAddress', internalType: 'address', type: 'address' },
          { name: 'variableDebtTokenAddress', internalType: 'address', type: 'address' },
          { name: 'interestRateStrategyAddress', internalType: 'address', type: 'address' },
          { name: 'availableLiquidity', internalType: 'uint256', type: 'uint256' },
          { name: 'totalPrincipalStableDebt', internalType: 'uint256', type: 'uint256' },
          { name: 'averageStableRate', internalType: 'uint256', type: 'uint256' },
          { name: 'stableDebtLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'totalScaledVariableDebt', internalType: 'uint256', type: 'uint256' },
          { name: 'priceInMarketReferenceCurrency', internalType: 'uint256', type: 'uint256' },
          { name: 'priceOracle', internalType: 'address', type: 'address' },
          { name: 'variableRateSlope1', internalType: 'uint256', type: 'uint256' },
          { name: 'variableRateSlope2', internalType: 'uint256', type: 'uint256' },
          { name: 'stableRateSlope1', internalType: 'uint256', type: 'uint256' },
          { name: 'stableRateSlope2', internalType: 'uint256', type: 'uint256' },
          { name: 'baseStableBorrowRate', internalType: 'uint256', type: 'uint256' },
          { name: 'baseVariableBorrowRate', internalType: 'uint256', type: 'uint256' },
          { name: 'optimalUsageRatio', internalType: 'uint256', type: 'uint256' },
          { name: 'isPaused', internalType: 'bool', type: 'bool' },
          { name: 'isSiloedBorrowing', internalType: 'bool', type: 'bool' },
          { name: 'accruedToTreasury', internalType: 'uint128', type: 'uint128' },
          { name: 'unbacked', internalType: 'uint128', type: 'uint128' },
          { name: 'isolationModeTotalDebt', internalType: 'uint128', type: 'uint128' },
          { name: 'flashLoanEnabled', internalType: 'bool', type: 'bool' },
          { name: 'debtCeiling', internalType: 'uint256', type: 'uint256' },
          { name: 'debtCeilingDecimals', internalType: 'uint256', type: 'uint256' },
          { name: 'eModeCategoryId', internalType: 'uint8', type: 'uint8' },
          { name: 'borrowCap', internalType: 'uint256', type: 'uint256' },
          { name: 'supplyCap', internalType: 'uint256', type: 'uint256' },
          { name: 'eModeLtv', internalType: 'uint16', type: 'uint16' },
          { name: 'eModeLiquidationThreshold', internalType: 'uint16', type: 'uint16' },
          { name: 'eModeLiquidationBonus', internalType: 'uint16', type: 'uint16' },
          { name: 'eModePriceSource', internalType: 'address', type: 'address' },
          { name: 'eModeLabel', internalType: 'string', type: 'string' },
          { name: 'borrowableInIsolation', internalType: 'bool', type: 'bool' },
        ],
      },
      {
        name: '',
        internalType: 'struct IUiPoolDataProviderV3.BaseCurrencyInfo',
        type: 'tuple',
        components: [
          { name: 'marketReferenceCurrencyUnit', internalType: 'uint256', type: 'uint256' },
          { name: 'marketReferenceCurrencyPriceInUsd', internalType: 'int256', type: 'int256' },
          { name: 'networkBaseTokenPriceInUsd', internalType: 'int256', type: 'int256' },
          { name: 'networkBaseTokenPriceDecimals', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'contract IPoolAddressesProvider', type: 'address' }],
    name: 'getReservesList',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'contract IPoolAddressesProvider', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserReservesData',
    outputs: [
      {
        name: '',
        internalType: 'struct IUiPoolDataProviderV3.UserReserveData[]',
        type: 'tuple[]',
        components: [
          { name: 'underlyingAsset', internalType: 'address', type: 'address' },
          { name: 'scaledATokenBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'usageAsCollateralEnabledOnUser', internalType: 'bool', type: 'bool' },
          { name: 'stableBorrowRate', internalType: 'uint256', type: 'uint256' },
          { name: 'scaledVariableDebt', internalType: 'uint256', type: 'uint256' },
          { name: 'principalStableDebt', internalType: 'uint256', type: 'uint256' },
          { name: 'stableBorrowLastUpdateTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'marketReferenceCurrencyPriceInUsdProxyAggregator',
    outputs: [{ name: '', internalType: 'contract IEACAggregatorProxy', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'networkBaseTokenPriceInUsdProxyAggregator',
    outputs: [{ name: '', internalType: 'contract IEACAggregatorProxy', type: 'address' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x36eddc380C7f370e5f05Da5Bd7F970a27f063e39)
 */
export const uiPoolDataProviderAddress = {
  1: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
  5: '0x36eddc380C7f370e5f05Da5Bd7F970a27f063e39',
  100: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x36eddc380C7f370e5f05Da5Bd7F970a27f063e39)
 */
export const uiPoolDataProviderConfig = { address: uiPoolDataProviderAddress, abi: uiPoolDataProviderAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// V3Migrator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe2a3C1ff038E14d401cA6dE0673a598C33168460)
 */
export const v3MigratorAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DAI',
    outputs: [{ name: '', internalType: 'contract IERC20WithPermit', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PSM',
    outputs: [{ name: '', internalType: 'contract PsmLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SPARK_POOL',
    outputs: [{ name: '', internalType: 'contract IPool', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STETH',
    outputs: [{ name: '', internalType: 'contract IERC20WithPermit', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'USDC',
    outputs: [{ name: '', internalType: 'contract IERC20WithPermit', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'V2_POOL',
    outputs: [{ name: '', internalType: 'contract ILendingPool', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'V3_POOL',
    outputs: [{ name: '', internalType: 'contract IPool', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WSTETH',
    outputs: [{ name: '', internalType: 'contract IWstETH', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'aTokens',
    outputs: [{ name: '', internalType: 'contract IERC20WithPermit', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'cacheATokens', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'assetsToFlash', internalType: 'address[]', type: 'address[]' },
      { name: 'amountsToFlash', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'initiator', internalType: 'address', type: 'address' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'executeOperation',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMigrationSupply',
    outputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assetsToMigrate', internalType: 'address[]', type: 'address[]' },
      {
        name: 'positionsToRepay',
        internalType: 'struct IMigrationHelper.RepaySimpleInput[]',
        type: 'tuple[]',
        components: [
          { name: 'asset', internalType: 'address', type: 'address' },
          { name: 'rateMode', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'permits',
        internalType: 'struct IMigrationHelper.PermitInput[]',
        type: 'tuple[]',
        components: [
          { name: 'aToken', internalType: 'contract IERC20WithPermit', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      {
        name: 'creditDelegationPermits',
        internalType: 'struct IMigrationHelper.CreditDelegationInput[]',
        type: 'tuple[]',
        components: [
          { name: 'debtToken', internalType: 'contract ICreditDelegationToken', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'migrate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      {
        name: 'emergencyInput',
        internalType: 'struct IMigrationHelper.EmergencyTransferInput[]',
        type: 'tuple[]',
        components: [
          { name: 'asset', internalType: 'contract IERC20WithPermit', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'to', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'rescueFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'sTokens',
    outputs: [{ name: '', internalType: 'contract IERC20WithPermit', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'vTokens',
    outputs: [{ name: '', internalType: 'contract IERC20WithPermit', type: 'address' }],
    stateMutability: 'view',
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe2a3C1ff038E14d401cA6dE0673a598C33168460)
 */
export const v3MigratorAddress = {
  1: '0xe2a3C1ff038E14d401cA6dE0673a598C33168460',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe2a3C1ff038E14d401cA6dE0673a598C33168460)
 */
export const v3MigratorConfig = { address: v3MigratorAddress, abi: v3MigratorAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vat
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xB966002DDAa2Baf48369f5015329750019736031)
 */
export const vatAbi = [
  { payable: false, type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: true,
    inputs: [
      { name: 'sig', internalType: 'bytes4', type: 'bytes4', indexed: true },
      { name: 'arg1', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'arg2', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'arg3', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'LogNote',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'Line',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'cage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'can',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'dai',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'debt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'deny',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32' },
      { name: 'what', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'file',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'what', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'file',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32' },
      { name: 'src', internalType: 'address', type: 'address' },
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'flux',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'i', internalType: 'bytes32', type: 'bytes32' },
      { name: 'u', internalType: 'address', type: 'address' },
      { name: 'rate', internalType: 'int256', type: 'int256' },
    ],
    name: 'fold',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32' },
      { name: 'src', internalType: 'address', type: 'address' },
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'dink', internalType: 'int256', type: 'int256' },
      { name: 'dart', internalType: 'int256', type: 'int256' },
    ],
    name: 'fork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'i', internalType: 'bytes32', type: 'bytes32' },
      { name: 'u', internalType: 'address', type: 'address' },
      { name: 'v', internalType: 'address', type: 'address' },
      { name: 'w', internalType: 'address', type: 'address' },
      { name: 'dink', internalType: 'int256', type: 'int256' },
      { name: 'dart', internalType: 'int256', type: 'int256' },
    ],
    name: 'frob',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'gem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'i', internalType: 'bytes32', type: 'bytes32' },
      { name: 'u', internalType: 'address', type: 'address' },
      { name: 'v', internalType: 'address', type: 'address' },
      { name: 'w', internalType: 'address', type: 'address' },
      { name: 'dink', internalType: 'int256', type: 'int256' },
      { name: 'dart', internalType: 'int256', type: 'int256' },
    ],
    name: 'grab',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'rad', internalType: 'uint256', type: 'uint256' }],
    name: 'heal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'hope',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ilks',
    outputs: [
      { name: 'Art', internalType: 'uint256', type: 'uint256' },
      { name: 'rate', internalType: 'uint256', type: 'uint256' },
      { name: 'spot', internalType: 'uint256', type: 'uint256' },
      { name: 'line', internalType: 'uint256', type: 'uint256' },
      { name: 'dust', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'ilk', internalType: 'bytes32', type: 'bytes32' }],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'live',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'src', internalType: 'address', type: 'address' },
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'rad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'move',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'nope',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: 'usr', internalType: 'address', type: 'address' }],
    name: 'rely',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'sin',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'ilk', internalType: 'bytes32', type: 'bytes32' },
      { name: 'usr', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'int256', type: 'int256' },
    ],
    name: 'slip',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: 'u', internalType: 'address', type: 'address' },
      { name: 'v', internalType: 'address', type: 'address' },
      { name: 'rad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'suck',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'urns',
    outputs: [
      { name: 'ink', internalType: 'uint256', type: 'uint256' },
      { name: 'art', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'vice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'wards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xB966002DDAa2Baf48369f5015329750019736031)
 */
export const vatAddress = {
  1: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
  5: '0xB966002DDAa2Baf48369f5015329750019736031',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xB966002DDAa2Baf48369f5015329750019736031)
 */
export const vatConfig = { address: vatAddress, abi: vatAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WETHGateway
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBD7D6a9ad7865463DE44B05F04559f65e3B11704)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe6fC577E87F7c977c4393300417dCC592D90acF8)
 */
export const wethGatewayAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'weth', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'pool', internalType: 'contract IPool', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'interestRateMode', internalType: 'uint256', type: 'uint256' },
      { name: 'referralCode', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'borrowETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: 'onBehalfOf', internalType: 'address', type: 'address' },
      { name: 'referralCode', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'depositETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'emergencyEtherTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'emergencyTokenTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWETHAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'rateMode', internalType: 'uint256', type: 'uint256' },
      { name: 'onBehalfOf', internalType: 'address', type: 'address' },
    ],
    name: 'repayETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'permitV', internalType: 'uint8', type: 'uint8' },
      { name: 'permitR', internalType: 'bytes32', type: 'bytes32' },
      { name: 'permitS', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'withdrawETHWithPermit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBD7D6a9ad7865463DE44B05F04559f65e3B11704)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe6fC577E87F7c977c4393300417dCC592D90acF8)
 */
export const wethGatewayAddress = {
  1: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
  5: '0xe6fC577E87F7c977c4393300417dCC592D90acF8',
  100: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBD7D6a9ad7865463DE44B05F04559f65e3B11704)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe6fC577E87F7c977c4393300417dCC592D90acF8)
 */
export const wethGatewayConfig = { address: wethGatewayAddress, abi: wethGatewayAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WalletBalanceProvider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x261135877A92B42183c998bFB8580558a28377a6)
 */
export const walletBalanceProviderAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'users', internalType: 'address[]', type: 'address[]' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'batchBalanceOf',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserWalletBalances',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x261135877A92B42183c998bFB8580558a28377a6)
 */
export const walletBalanceProviderAddress = {
  1: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
  5: '0x261135877A92B42183c998bFB8580558a28377a6',
  100: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x261135877A92B42183c998bFB8580558a28377a6)
 */
export const walletBalanceProviderConfig = {
  address: walletBalanceProviderAddress,
  abi: walletBalanceProviderAbi,
} as const
