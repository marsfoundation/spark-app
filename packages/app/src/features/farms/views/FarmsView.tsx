import { PageLayout } from '@/ui/layouts/PageLayout'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { PageHeader } from '../components/PageHeader'
import { FarmTile, FarmTileProps } from '../components/farm-tile/FarmTile'

export interface FarmsViewProps {
  activeFarms: FarmTileProps[]
  inactiveFarms: FarmTileProps[]
  chainId: number
}

export function FarmsView({ activeFarms, inactiveFarms, chainId }: FarmsViewProps) {
  return (
    <PageLayout>
      <PageHeader chainId={chainId} />
      <div className="flex flex-col gap-8">
        {activeFarms.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className={cn('typography-heading-4', inactiveFarms.length === 0 && 'hidden')}>Active farms</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8">
              {activeFarms.map((farm, index) => (
                <FarmTile key={farm.detailsLink} data-testid={testIds.farms.active.tile(index)} {...farm} />
              ))}
            </div>
          </div>
        )}
        {activeFarms.length > 0 && inactiveFarms.length > 0 && <div className="border-primary border-t" />}
        {inactiveFarms.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className={cn('typography-heading-4', activeFarms.length === 0 && 'hidden')}>Available farms</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8">
              {inactiveFarms.map((farm, index) => (
                <FarmTile key={farm.detailsLink} data-testid={testIds.farms.inactive.tile(index)} {...farm} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
