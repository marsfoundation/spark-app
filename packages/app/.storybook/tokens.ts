import { CheckedAddress } from '../src/domain/types/CheckedAddress'
import { Token } from '../src/domain/types/Token'
import { TokenSymbol } from '../src/domain/types/TokenSymbol'

export const tokens = {
  ETH: new Token({
    unitPriceUsd: '2235.0672',
    symbol: TokenSymbol('ETH'),
    name: 'Ether',
    decimals: 18,
    address: CheckedAddress('0x7D5afF7ab67b431cDFA6A94d50d3124cC4AB2611'),
  }),
  DAI: new Token({
    unitPriceUsd: '1.00001023',
    symbol: TokenSymbol('DAI'),
    name: 'Dai Stablecoin',
    decimals: 18,
    address: CheckedAddress('0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'),
  }),
  sDAI: new Token({
    unitPriceUsd: '1.02847014',
    symbol: TokenSymbol('sDAI'),
    name: 'Savings Dai',
    decimals: 18,
    address: CheckedAddress('0xD8134205b0328F5676aaeFb3B2a0DC15f4029d8C'),
  }),
  NST: new Token({
    unitPriceUsd: '1',
    symbol: TokenSymbol('NST'),
    name: 'New Stable Token',
    decimals: 18,
    address: CheckedAddress('0x1fe430D2B3c1aA3333414C6bb142987AD3551D52'),
  }),
  sNST: new Token({
    unitPriceUsd: '1.02847014',
    symbol: TokenSymbol('sNST'),
    name: 'Savings NST',
    decimals: 18,
    address: CheckedAddress('0x11B85a86BAE72A472837613A10bc53582f7c6E22'),
  }),
  USDC: new Token({
    unitPriceUsd: '1',
    symbol: TokenSymbol('USDC'),
    name: 'USDC',
    decimals: 6,
    address: CheckedAddress('0x6Fb5ef893d44F4f88026430d82d4ef269543cB23'),
  }),
  WETH: new Token({
    unitPriceUsd: '2235.0672',
    symbol: TokenSymbol('wETH'),
    name: 'Wrapped Ether',
    decimals: 18,
    address: CheckedAddress('0x7D5afF7ab67b431cDFA6A94d50d3124cC4AB2611'),
  }),
  weETH: new Token({
    unitPriceUsd: '2235.0672',
    symbol: TokenSymbol('weETH'),
    name: 'Ether.fi Staked ETH',
    decimals: 18,
    address: CheckedAddress('0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee'),
  }),
  wstETH: new Token({
    unitPriceUsd: '2235.0672',
    symbol: TokenSymbol('wstETH'),
    name: 'Wrapped liquid staked Ether 2.0',
    decimals: 18,
    address: CheckedAddress('0x6E4F1e8d4c5E5E6e2781FD814EE0744cc16Eb352'),
  }),
  stETH: new Token({
    unitPriceUsd: '2235.0672',
    symbol: TokenSymbol('stETH'),
    name: 'Liquid staked Ether 2.0',
    decimals: 18,
    address: CheckedAddress('0x6E4F1e8d4c5E5E6e2781FD814EE0744cc16Eb352'),
  }),
  WBTC: new Token({
    unitPriceUsd: '42189.925',
    symbol: TokenSymbol('WBTC'),
    name: 'Wrapped BTC',
    decimals: 8,
    address: CheckedAddress('0x91277b74a9d1Cc30fA0ff4927C287fe55E307D78'),
  }),
  GNO: new Token({
    unitPriceUsd: '99.98724155',
    symbol: TokenSymbol('GNO'),
    name: 'Gnosis',
    decimals: 18,
    address: CheckedAddress('0x86Bc432064d7F933184909975a384C7E4c9d0977'),
  }),
  rETH: new Token({
    unitPriceUsd: '2235.0672',
    symbol: TokenSymbol('rETH'),
    name: 'Rocket Pool ETH',
    decimals: 18,
    address: CheckedAddress('0x62BC478FFC429161115A6E4090f819CE5C50A5d9'),
  }),
  get arETH() {
    return this.rETH.createAToken(CheckedAddress('0x9985dF20D7e9103ECBCeb16a84956434B6f06ae8'))
  },
  MKR: new Token({
    unitPriceUsd: '1403.75',
    symbol: TokenSymbol('MKR'),
    name: 'Maker',
    decimals: 18,
    address: CheckedAddress('0x62BC478FFC429161115A6E4090f819CE5C50A5d9'),
  }),
  USDT: new Token({
    unitPriceUsd: '1',
    symbol: TokenSymbol('USDT'),
    name: 'Tether USD',
    decimals: 18,
    address: CheckedAddress('0x62BC478FFC429161115A6E4090f819CE5C50A5d9'),
  }),
  XDAI: new Token({
    unitPriceUsd: '1',
    symbol: TokenSymbol('XDAI'),
    name: 'XDAI',
    decimals: 18,
    address: CheckedAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'),
  }),
}
