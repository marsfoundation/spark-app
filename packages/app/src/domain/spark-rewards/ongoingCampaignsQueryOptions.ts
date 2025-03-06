import { SupportedChainId } from '@/config/chain/types'
import { spark2ApiUrl } from '@/config/consts'
import { checkedAddressSchema, percentageSchema } from '@/domain/common/validation'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Percentage, assertNever, raise } from '@marsfoundation/common-universal'
import { queryOptions } from '@tanstack/react-query'
import { Address, erc20Abi } from 'viem'
import { arbitrum, base, gnosis, mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'

export interface OngoingCampaignsQueryOptionsParams {
  wagmiConfig: Config
}

export type OngoingCampaign = {
  id: string
  shortDescription: string
  longDescription: string
  rewardTokenSymbol: TokenSymbol
  chainId: number
  restrictedCountryCodes: string[]
} & (
  | {
      type: 'sparklend'
      apy?: Percentage
      depositTokenSymbols: TokenSymbol[]
      borrowTokenSymbols: TokenSymbol[]
    }
  | {
      type: 'savings'
      apy?: Percentage
      depositToSavingsTokenSymbols: TokenSymbol[]
    }
  | {
      type: 'social'
      platform: 'x' | 'discord'
      link: string
    }
  | {
      type: 'external'
      link: string
    }
)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ongoingCampaignsQueryOptions({ wagmiConfig }: OngoingCampaignsQueryOptionsParams) {
  return queryOptions<OngoingCampaign[]>({
    queryKey: ['ongoing-campaigns'],
    queryFn: async () => {
      const response = await fetch(`${spark2ApiUrl}/rewards/campaigns/`)
      if (!response.ok) {
        throw new Error('Error fetching ongoing campaigns')
      }
      const campaignsData = ongoingCampaignsResponseSchema.parse(await response.json())

      return Promise.all(
        campaignsData.map(async (campaign) => {
          async function fetchTokenSymbol(address: Address): Promise<string> {
            return readContract(wagmiConfig, {
              address,
              abi: erc20Abi,
              functionName: 'symbol',
              chainId: domainToChainId(campaign.domain),
            })
          }
          const [rewardTokenSymbol, depositTokenSymbols, borrowTokenSymbols, depositToSavingsTokenSymbols] =
            await Promise.all([
              fetchTokenSymbol(campaign.reward_token_address),
              Promise.all(campaign.type === 'sparklend' ? campaign.deposit_token_addresses.map(fetchTokenSymbol) : []),
              Promise.all(campaign.type === 'sparklend' ? campaign.borrow_token_addresses.map(fetchTokenSymbol) : []),
              Promise.all(campaign.type === 'savings' ? campaign.deposit_to_token_addresses.map(fetchTokenSymbol) : []),
            ])

          const commonProps = {
            id: campaign.campaign_uid,
            shortDescription: campaign.short_description,
            longDescription: campaign.long_description,
            restrictedCountryCodes: campaign.restricted_country_codes,
            rewardTokenSymbol: TokenSymbol(rewardTokenSymbol),
            chainId: domainToChainId(campaign.domain),
          }

          switch (campaign.type) {
            case 'sparklend':
              return {
                ...commonProps,
                type: campaign.type,
                apy: campaign.apy ? Percentage(campaign.apy) : undefined,
                depositTokenSymbols: depositTokenSymbols.map(TokenSymbol),
                borrowTokenSymbols: borrowTokenSymbols.map(TokenSymbol),
              }
            case 'savings':
              return {
                ...commonProps,
                type: campaign.type,
                apy: campaign.apy ? Percentage(campaign.apy) : undefined,
                depositToSavingsTokenSymbols: depositToSavingsTokenSymbols.map(TokenSymbol),
              }
            case 'social':
              return {
                ...commonProps,
                type: 'social',
                platform: campaign.platform,
                link: campaign.link,
              }
            case 'external':
              return {
                ...commonProps,
                type: 'external',
                link: campaign.link,
              }
            default:
              assertNever(campaign)
          }
        }),
      )
    },
  })
}

const allowedDomains = ['mainnet', 'arbitrum', 'base', 'gnosis'] as const
type Domain = (typeof allowedDomains)[number]

const baseOngoingCampaignSchema = z.object({
  campaign_uid: z.string(),
  short_description: z.string(),
  long_description: z.string(),
  domain: z.enum(allowedDomains),
  restricted_country_codes: z.array(z.string()),
  reward_token_address: checkedAddressSchema,
})

const ongoingCampaignsResponseSchema = z.array(
  z.discriminatedUnion('type', [
    baseOngoingCampaignSchema.extend({
      type: z.literal('sparklend'),
      apy: percentageSchema.nullable(),
      deposit_token_addresses: z.array(checkedAddressSchema),
      borrow_token_addresses: z.array(checkedAddressSchema),
    }),
    baseOngoingCampaignSchema.extend({
      type: z.literal('savings'),
      apy: percentageSchema.nullable(),
      deposit_to_token_addresses: z.array(checkedAddressSchema),
    }),
    baseOngoingCampaignSchema.extend({
      type: z.literal('social'),
      platform: z.enum(['x', 'discord']),
      link: z.string(),
    }),
    baseOngoingCampaignSchema.extend({
      type: z.literal('external'),
      link: z.string(),
    }),
  ]),
)

function domainToChainId(domain: Domain): SupportedChainId {
  switch (domain) {
    case 'mainnet':
      return mainnet.id
    case 'arbitrum':
      return arbitrum.id
    case 'base':
      return base.id
    case 'gnosis':
      return gnosis.id
    default:
      raise(`Unsupported domain: ${domain}`)
  }
}
