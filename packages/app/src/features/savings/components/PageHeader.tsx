import { Info } from '@/ui/molecules/info/Info'

export function PageHeader() {
  return (
    <h1 className="flex items-center gap-2 font-semibold text-3xl sm:text-4xl">
      Savings
      <Info className="mt-1">
        Spark Savings offers a seamless way to exchange stablecoins with sUSDS and sDAI using SKY's decentralized and
        non-custodial smart contracts.
      </Info>
    </h1>
  )
}
