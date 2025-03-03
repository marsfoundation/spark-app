import { assets } from '@/ui/assets'

export function PlusSparkRewards({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1">
      <span>+</span>
      <img src={assets.page.sparkRewardsCircle} alt={'Spark Rewards'} className="size-4 lg:size-5" />
      <span className="bg-gradient-spark-rewards-1 bg-clip-text text-transparent">{text}</span>
    </div>
  )
}
