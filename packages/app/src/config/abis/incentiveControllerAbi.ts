export const incentiveControllerAbi = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'claimAllRewards',
    outputs: [
      {
        internalType: 'address[]',
        name: 'rewardsList',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'claimedAmounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
