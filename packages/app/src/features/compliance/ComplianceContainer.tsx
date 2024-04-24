import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { AddressBlocked } from './components/AddressBlocked'
import { PageNotAvailable } from './components/PageNotAvailable'
import { RegionBlocked } from './components/RegionBlocked'
import { TermsOfService } from './components/TermsOfService'
import { VPNBlocked } from './components/VPNBlocked'
import { useCompliance } from './logic/useCompliance'

export function ComplianceContainer() {
  const { visibleModal } = useCompliance()

  return (
    <Dialog open={visibleModal.type !== 'none'}>
      <DialogContent showCloseButton={false}>
        {visibleModal.type === 'terms-of-service' && <TermsOfService onAgree={visibleModal.onAgreeToTermsOfService} />}
        {visibleModal.type === 'vpn-detected' && <VPNBlocked />}
        {visibleModal.type === 'region-blocked' && <RegionBlocked countryCode={visibleModal.countryCode} />}
        {visibleModal.type === 'feature-not-available-in-region' && (
          <PageNotAvailable countryCode={visibleModal.countryCode} />
        )}
        {visibleModal.type === 'address-not-allowed' && (
          <AddressBlocked address={visibleModal.address} disconnect={visibleModal.disconnect} />
        )}
      </DialogContent>
    </Dialog>
  )
}
