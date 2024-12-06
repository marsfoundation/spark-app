import { Button } from '@/ui/atoms/button/Button'
import { shortenAddress } from '@/ui/utils/shortenAddress'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { Banner } from './Banner'

export interface AddressBlockedProps {
  address: CheckedAddress
  disconnect: () => void
}
export function AddressBlocked({ disconnect, address }: AddressBlockedProps) {
  return (
    <Banner>
      <Banner.Content>
        <Banner.Header> Address blocked </Banner.Header>
        <Banner.Description>
          We're sorry but address <strong>{shortenAddress(address, { startLength: 10 })}</strong> is blacklisted.
        </Banner.Description>
      </Banner.Content>
      <Button className="w-full" size="l" onClick={() => disconnect()}>
        Disconnect wallet
      </Button>
    </Banner>
  )
}
