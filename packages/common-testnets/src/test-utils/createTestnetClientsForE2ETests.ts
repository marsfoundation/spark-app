import { getEnv } from '@marsfoundation/common-nodejs/env'
import { TestnetFactory } from '../TestnetFactory'
import { AnvilTestnetFactory } from '../anvil'
import { TenderlyTestnetFactory } from '../tenderly'

export function createTestnetClientsForE2ETests(): TestnetFactory[] {
  const env = getEnv()

  return [
    new TenderlyTestnetFactory({
      apiKey: env.string('TENDERLY_API_KEY'),
      account: env.string('TENDERLY_ACCOUNT'),
      project: env.string('TENDERLY_PROJECT'),
    }),
    new AnvilTestnetFactory({ alchemyApiKey: env.string('TEST_E2E_ALCHEMY_API_KEY') }),
  ]
}
