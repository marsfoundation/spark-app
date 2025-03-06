import { BaseUnitNumber, CheckedAddress } from '@marsfoundation/common-universal'
import { expect } from 'earl'
import { isAddressEqual, parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { TestnetClient } from '../TestnetClient.js'
import { createTestnetFactoriesForE2ETests } from '../test-utils/createTestnetFactoriesForE2ETests.js'
import { setATokenBalance, setAaveUsingAsCollateral } from './aave.js'

const wstETH = CheckedAddress('0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0')
const spwstETH = CheckedAddress('0x12B54025C112Aa61fAce2CDB7118740875A566E9')
const account = CheckedAddress.random('alice')

const factories = createTestnetFactoriesForE2ETests()

for (const factory of factories.slice(0, 1)) {
  describe(factory.constructor.name, () => {
    let testnetClient: TestnetClient
    let cleanup: () => Promise<void>

    before(async () => {
      ;({ client: testnetClient, cleanup } = await factory.create({
        id: 'test',
        originChain: mainnet,
        forkChainId: 1,
        blockNumber: 21439277n,
      }))
      await testnetClient.baselineSnapshot()
    })
    after(async () => {
      await cleanup()
    })
    beforeEach(async () => {
      await testnetClient.revertToBaseline()
    })

    it(setATokenBalance.name, async () => {
      const wstETHReserveBefore = await getUserReserve({ testnetClient, account, underlyingAsset: wstETH })
      expect(wstETHReserveBefore?.scaledATokenBalance).toEqual(0n)

      const newBalance = BaseUnitNumber(parseEther('1'))
      const expectedScaledATokenBalance = 999959801482089561n // just a snapshot

      await setATokenBalance({
        client: testnetClient,
        aTokenAddress: spwstETH,
        account,
        balance: newBalance,
      })

      const wstETHReserveAfter = await getUserReserve({ testnetClient, account, underlyingAsset: wstETH })
      expect(wstETHReserveAfter?.scaledATokenBalance).toEqual(expectedScaledATokenBalance)
    })

    it(setAaveUsingAsCollateral.name, async () => {
      const wstETHReserveBefore = await getUserReserve({ testnetClient, account, underlyingAsset: wstETH })
      expect(wstETHReserveBefore?.usageAsCollateralEnabledOnUser).toEqual(false)

      await setAaveUsingAsCollateral({
        client: testnetClient,
        lendingPoolAddress,
        tokenAddress: wstETH,
        account,
        usingAsCollateral: true,
      })

      const wstETHReserveAfterEnabling = await getUserReserve({ testnetClient, account, underlyingAsset: wstETH })
      expect(wstETHReserveAfterEnabling?.usageAsCollateralEnabledOnUser).toEqual(true)

      await setAaveUsingAsCollateral({
        client: testnetClient,
        lendingPoolAddress,
        tokenAddress: wstETH,
        account,
        usingAsCollateral: false,
      })

      const wstETHReserveAfterDisabling = await getUserReserve({ testnetClient, account, underlyingAsset: wstETH })
      expect(wstETHReserveAfterDisabling?.usageAsCollateralEnabledOnUser).toEqual(false)
    })
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function getUserReserve({
  testnetClient,
  account,
  underlyingAsset,
}: { testnetClient: TestnetClient; account: CheckedAddress; underlyingAsset: CheckedAddress }) {
  const [userReservesData] = await testnetClient.readContract({
    address: CheckedAddress(uiPoolDataProviderAddress),
    abi: uiPoolDataProviderAbi,
    functionName: 'getUserReservesData',
    args: [lendingPoolAddressProviderAddress, account],
  })

  return userReservesData.find((reserve) => isAddressEqual(reserve.underlyingAsset, underlyingAsset))
}

const uiPoolDataProviderAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'provider',
        internalType: 'contract IPoolAddressesProvider',
        type: 'address',
      },
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
          {
            name: 'scaledATokenBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'usageAsCollateralEnabledOnUser',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'stableBorrowRate',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'scaledVariableDebt',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'principalStableDebt',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'stableBorrowLastUpdateTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      { name: '', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
] as const

const uiPoolDataProviderAddress = CheckedAddress('0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb')
const lendingPoolAddressProviderAddress = CheckedAddress('0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE')
const lendingPoolAddress = CheckedAddress('0xC13e21B648A5Ee794902342038FF3aDAB66BE987')
