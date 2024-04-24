import { Banner } from './Banner'

export function VPNBlocked() {
  return (
    <Banner>
      <Banner.Content>
        <Banner.Header> VPN detected </Banner.Header>
        <Banner.Description>We're sorry but this app is not accessible for VPN users.</Banner.Description>
      </Banner.Content>
    </Banner>
  )
}
