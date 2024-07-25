import { Page, test } from '@playwright/test'

import { tenderlyRpcActions } from '@/domain/tenderly/TenderlyRpcActions'
import { http, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { injectUpdatedDate } from '../injectSetup'
import { processEnv } from '../processEnv'
import { ITestForkService } from './ITestForkService'
import { TestTenderlyForkService } from './TestTenderlyForkService'
import { TestTenderlyVnetService } from './TestTenderlyVnetService'

export interface ForkContext {
  forkUrl: string
  forkService: ITestForkService
  initialSnapshotId: string
  isVnet: boolean
  chainId: number
  simulationDate: Date

  progressSimulation(page: Page, seconds: number): Promise<void>
}

// @note: https://github.com/marsfoundation/app#deterministic-time-in-e2e-tests
// used only with tenderly forks (not vnets)
export const _simulationDate = new Date('2024-06-04T10:21:19Z')

/**
 * Fork is shared across the whole test file and is fixed to a single block number.
 * It's created once and deleted after all tests are finished but after each test it's reverted to the initial state.
 */
export interface SetupForkOptions {
  blockNumber: bigint
  chainId: number
  useTenderlyVnet?: boolean // vnets are more powerful forks alternative provided by Tenderly
  simulationDateOverride?: Date
}

export function setupFork({
  blockNumber,
  chainId,
  simulationDateOverride,
  useTenderlyVnet: isVnet = false,
}: SetupForkOptions): ForkContext {
  const apiKey = processEnv('TENDERLY_API_KEY')
  const tenderlyAccount = processEnv('TENDERLY_ACCOUNT')
  const tenderlyProject = processEnv('TENDERLY_PROJECT')

  const forkService: ITestForkService = isVnet
    ? new TestTenderlyVnetService({ apiKey, account: tenderlyAccount, project: tenderlyProject })
    : new TestTenderlyForkService({ apiKey, tenderlyAccount, tenderlyProject })

  const simulationDate = simulationDateOverride ?? (!isVnet ? _simulationDate : undefined) // undefined means get it based on block number

  const forkContext: ForkContext = {
    forkService,
    // we lie to typescript here, because it will be set in beforeAll
    forkUrl: undefined as any,
    isVnet: isVnet,
    initialSnapshotId: undefined as any,
    simulationDate: simulationDate as any,
    chainId,

    async progressSimulation(page: Page, seconds: number): Promise<void> {
      this.simulationDate = new Date(this.simulationDate.getTime() + seconds * 1000)
      const newTimestamp = Math.floor(this.simulationDate.getTime() / 1000)

      await injectUpdatedDate(page, this.simulationDate)
      await tenderlyRpcActions.evmSetNextBlockTimestamp(forkContext.forkUrl, Number(newTimestamp))
    },
  }
  // @todo refactor after dropping tenderly fork support

  test.beforeAll(async () => {
    forkContext.forkUrl = await forkService.createFork({
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
      await tenderlyRpcActions.evmSetNextBlockTimestamp(forkContext.forkUrl, Number(block.timestamp))
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
      await forkService.deleteFork(forkContext.forkUrl)
    }
  })

  return forkContext
}