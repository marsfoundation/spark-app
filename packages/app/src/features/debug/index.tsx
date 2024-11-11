import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { Button } from '@/ui/atoms/new/button/Button'
import { useTimestamp } from '@/utils/useTimestamp'
import { UseQueryReturnType } from 'node_modules/wagmi/dist/types/utils/query'
import { mainnet } from 'viem/chains'
import { useReadContract } from 'wagmi'

export function Debug() {
  const blockTimestamp = useMulticallBlockTimestamp()
  const browserTimestamp = new Date()
  const browserTimestampNow = useTimestamp({ refreshIntervalInMs: 500 })
  const makerPotAddress = getContractAddress(potAddress, mainnet.id)
  const rho = useReadContract({
    address: makerPotAddress,
    functionName: 'rho',
    args: [],
    abi: potAbi,
  })
  const daiTimestamp = (!!rho.data && new Date(Number(rho.data) * 1000)) || undefined

  return (
    <div>
      <p className="m-2 text-md">Block timestamp (multicall): {blockTimestamp.timestampDate?.toISOString() ?? '-'}</p>
      <p className="m-2 text-md">POT timestamp (rho): {daiTimestamp?.toISOString() ?? '-'}</p>
      <p className="m-2 text-md">Browser timestamp: {browserTimestamp.toISOString()}</p>
      <p className="m-2 text-md">
        Browser timestamp now (useTimestamp): {new Date(browserTimestampNow.timestampInMs).toISOString()}
      </p>

      <Button
        onClick={async () => {
          await rho.refetch()
          await blockTimestamp.refetch()
        }}
        size="s"
        variant="secondary"
      >
        REFETCH POT Timestamp
      </Button>
    </div>
  )
}

export function useMulticallBlockTimestamp(): UseQueryReturnType & { timestampDate?: Date } {
  const response = useReadContract({
    abi,
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    functionName: 'getCurrentBlockTimestamp',
  })

  return {
    ...response,
    timestampDate: response.data !== undefined ? new Date(Number(response.data) * 1000) : undefined,
  }
}

const abi = [
  {
    inputs: [],
    name: 'getBlockNumber',
    outputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
