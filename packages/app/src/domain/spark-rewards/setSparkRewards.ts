import { sparkRewardsConfig } from '@/config/contracts-generated'
import { TestnetClient } from '@marsfoundation/common-testnets'
import { assert, BaseUnitNumber, CheckedAddress, Hex, toBigInt } from '@marsfoundation/common-universal'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import { Hash, encodeFunctionData, erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'

export interface SetSparkRewardsParams {
  testnetClient: TestnetClient
  account: CheckedAddress
  rewards: {
    token: CheckedAddress
    cumulativeAmount: BaseUnitNumber
  }[]
  afterTx?: () => Promise<void>
}

export interface SetSparkRewardsResult {
  merkleRoot: Hash
  proofs: {
    token: CheckedAddress
    cumulativeAmount: BaseUnitNumber
    proof: Hex[]
  }[]
}

export async function setSparkRewards({
  testnetClient,
  account,
  rewards,
  afterTx,
}: SetSparkRewardsParams): Promise<SetSparkRewardsResult> {
  const epoch = 1
  const merkleTree = StandardMerkleTree.of(
    rewards.map((reward) => [epoch.toString(), account, reward.token, reward.cumulativeAmount.toFixed()]),
    ['uint256', 'address', 'address', 'uint256'],
  )

  const merkleRoot = Hex(merkleTree.root)

  await assertSendTransaction(testnetClient, {
    account: '0x4b340357aadd38403e5c8e64368fd502ed38df6a',
    data: encodeFunctionData({
      abi: sparkRewardsConfig.abi,
      functionName: 'setMerkleRoot',
      args: [merkleRoot],
    }),
    to: sparkRewardsConfig.address[mainnet.id],
    chain: null,
  })
  await afterTx?.()

  const wallet = await testnetClient.readContract({
    address: sparkRewardsConfig.address[mainnet.id],
    abi: sparkRewardsConfig.abi,
    functionName: 'wallet',
  })

  for (const { token, cumulativeAmount } of rewards) {
    const cumulativeAmountBigInt = toBigInt(cumulativeAmount)

    await testnetClient.setErc20Balance(token, wallet, cumulativeAmountBigInt)
    await afterTx?.()

    await assertSendTransaction(testnetClient, {
      account: '0x4b340357aadd38403e5c8e64368fd502ed38df6a',
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [sparkRewardsConfig.address[mainnet.id], cumulativeAmountBigInt],
      }),
      to: token,
      chain: null,
    })
    await afterTx?.()
  }

  return {
    merkleRoot,
    proofs: rewards.map((reward) => {
      const proof = merkleTree.getProof([epoch.toString(), account, reward.token, reward.cumulativeAmount.toFixed()])
      return {
        ...reward,
        proof: proof.map((p) => Hex(p)),
      }
    }),
  }
}

async function assertSendTransaction(
  testnetClient: TestnetClient,
  params: Parameters<TestnetClient['sendTransaction']>[0],
): Promise<void> {
  const hash = await testnetClient.sendTransaction(params)
  const { status } = await testnetClient.waitForTransactionReceipt({
    hash,
  })
  assert(status === 'success', 'Transaction failed')
}
