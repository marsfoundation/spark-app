import { test } from '@playwright/test'

import { ITestTenderlyService } from '@/domain/tenderly/ITestTenderlyService'
import { tenderlyRpcActions } from '@/domain/tenderly/TenderlyRpcActions'
import { TestTenderlyForkService } from '@/domain/tenderly/TestTenderlyForkService'
import { http, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { TestTenderlyVnetService } from '../../domain/tenderly/TestTenderlyVnetService'
import { processEnv } from './processEnv'

export interface ForkContext {
  forkUrl: string
  tenderlyClient: ITestTenderlyService
  initialSnapshotId: string
  simulationDate: Date
  isVnet: boolean
  chainId: number
}

// @note: https://github.com/marsfoundation/app#deterministic-time-in-e2e-tests
export const _simulationDate = new Date('2024-06-04T10:21:19Z')

/**
 * Fork is shared across the whole test file and is fixed to a single block number.
 * It's created once and deleted after all tests are finished but after each test it's reverted to the initial state.
 */
export interface SetupForkOptions {
  blockNumber: bigint
  chainId: number
  isVnet?: boolean // vnets are more powerful forks alternative provided by Tenderly
  simulationDateOverride?: Date
}

export function setupFork({
  blockNumber,
  chainId,
  simulationDateOverride,
  isVnet = false,
}: SetupForkOptions): ForkContext {
  const apiKey = processEnv('TENDERLY_API_KEY')
  const tenderlyAccount = processEnv('TENDERLY_ACCOUNT')
  const tenderlyProject = processEnv('TENDERLY_PROJECT')

  const tenderlyClient: ITestTenderlyService = isVnet
    ? new TestTenderlyVnetService({ apiKey, account: tenderlyAccount, project: tenderlyProject })
    : new TestTenderlyForkService({ apiKey, tenderlyAccount, tenderlyProject })

  const simulationDate = simulationDateOverride ?? !isVnet ? _simulationDate : undefined // undefined means get it based on block number

  const forkContext: ForkContext = {
    tenderlyClient,
    // we lie to typescript here, because it will be set in beforeAll
    forkUrl: undefined as any,
    isVnet: isVnet,
    initialSnapshotId: undefined as any,
    simulationDate: simulationDate as any,
    chainId,
  }
  // @todo refactor after dropping tenderly fork support

  test.beforeAll(async () => {
    forkContext.forkUrl = await tenderlyClient.createFork({
      blockNumber,
      originChainId: chainId,
      forkChainId: chainId,
    })

    if (simulationDate) {
      const deltaTimeForward = Math.floor((simulationDate.getTime() - Date.now()) / 1000)
      await tenderlyRpcActions.evmIncreaseTime(forkContext.forkUrl, deltaTimeForward)
    } else {
      const client = createPublicClient({
        chain: mainnet, // @todo select chain based on chainId
        transport: http(forkContext.forkUrl),
      })

      const block = await client.getBlock({ blockNumber: blockNumber - 1n })
      forkContext.simulationDate = new Date(Number(block.timestamp) * 1000)
    }

    forkContext.initialSnapshotId = await tenderlyRpcActions.snapshot(forkContext.forkUrl)
  })

  test.beforeEach(async () => {
    await tenderlyRpcActions.revertToSnapshot(forkContext.forkUrl, forkContext.initialSnapshotId)
  })

  test.afterAll(async () => {
    if (processEnv.optionalBoolean('TENDERLY_PERSIST_FORK')) {
      return
    }

    if (forkContext.forkUrl) {
      await tenderlyClient.deleteFork(forkContext.forkUrl)
    }
  })

  return forkContext
}
