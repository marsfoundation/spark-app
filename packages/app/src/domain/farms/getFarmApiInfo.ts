import { infoSkyApiUrl } from '@/config/consts'
import { FarmApiInfo, FarmConfig } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { z } from 'zod'
import { normalizedUnitNumberSchema, percentageAboveOneSchema } from '../common/validation'

export interface GetFarmParams {
  farmConfig: FarmConfig
}

export async function getFarmApiInfo({ farmConfig }: GetFarmParams): Promise<FarmApiInfo> {
  const baData = await getBAFarmData({ farmConfig })
  const rewardTokenPriceUsd = farmConfig.rewardType === 'token' ? baData.rewardTokenPriceUsd : undefined

  return {
    address: farmConfig.address,
    apy: baData.apy,
    totalRewarded: baData.totalRewarded,
    rewardTokenPriceUsd,
    depositors: baData.depositors,
  }
}

interface GetFarmBADataParams {
  farmConfig: FarmConfig
}

interface GetFarmBADataResult {
  apy: Percentage
  depositors: number
  rewardTokenPriceUsd: NormalizedUnitNumber
  totalRewarded: NormalizedUnitNumber
}

async function getBAFarmData({ farmConfig }: GetFarmBADataParams): Promise<GetFarmBADataResult> {
  const res = await fetch(`${infoSkyApiUrl}/farms/${farmConfig.address.toLowerCase()}/`)
  if (!res.ok) {
    throw new Error(`Failed to fetch farm data: ${res.statusText}`)
  }

  return baFarmDataResponseSchema.parse(await res.json())
}

const baFarmDataResponseSchema = z
  .object({
    apy: percentageAboveOneSchema,
    depositors: z.number(),
    price: normalizedUnitNumberSchema,
    total_farmed: normalizedUnitNumberSchema,
  })
  .transform(({ apy, depositors, price, total_farmed }) => ({
    apy,
    depositors,
    rewardTokenPriceUsd: NormalizedUnitNumber(price),
    totalRewarded: total_farmed,
  }))