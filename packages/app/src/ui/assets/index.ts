import { TokenSymbol } from '@/domain/types/TokenSymbol'

import approve from './actions/approve.svg'
import borrow from './actions/borrow.svg'
import deposit from './actions/deposit.svg'
import done from './actions/done.svg'
import exchange from './actions/exchange.svg'
import repay from './actions/repay.svg'
import withdraw from './actions/withdraw.svg'
import arrowRight from './arrow-right.svg'
import boxArrowTopRight from './box-arrow-top-right.svg'
import ethereum from './chains/ethereum.svg'
import gnosis from './chains/gnosis.svg'
import checkCircle from './check-circle.svg'
import chevronDown from './chevron-down.svg'
import circleInfo from './circle-info.svg'
import close from './close.svg'
import down from './down.svg'
import eye from './eye.svg'
import flash from './flash.svg'
import greenArrowUp from './green-arrow-up.svg'
import lifiLogo from './lifi-logo.svg'
import link from './link.svg'
import magicWand from './magic-wand.svg'
import makerLogo from './maker.svg'
import chart from './markets/chart.svg'
import inputOutput from './markets/input-output.svg'
import lock from './markets/lock.svg'
import output from './markets/output.svg'
import menu from './menu.svg'
import moreIcon from './more-icon.svg'
import pause from './pause.svg'
import sliderThumb from './slider-thumb.svg'
import snowflake from './snowflake.svg'
import sparkIcon from './spark-icon.svg'
import sparkLogo from './spark-logo.svg'
import success from './success.svg'
import threeDots from './three-dots.svg'
import dai from './tokens/dai.svg'
import eth from './tokens/eth.svg'
import eure from './tokens/eure.svg'
import gno from './tokens/gno.svg'
import mkr from './tokens/mkr.svg'
import reth from './tokens/reth.svg'
import sdai from './tokens/sdai.svg'
import steth from './tokens/steth.svg'
import unknown from './tokens/unknown.svg'
import usdc from './tokens/usdc.svg'
import usdt from './tokens/usdt.svg'
import wbtc from './tokens/wbtc.svg'
import weeth from './tokens/weeth.svg'
import weth from './tokens/weth.svg'
import wsteth from './tokens/wsteth.svg'
import wxdai from './tokens/wxdai.svg'
import xdai from './tokens/xdai.svg'
import up from './up.svg'
import coinbase from './wallet-icons/coinbase.svg'
import defaultWallet from './wallet-icons/default.svg'
import enjin from './wallet-icons/enjin.svg'
import metamask from './wallet-icons/metamask.svg'
import torus from './wallet-icons/torus.svg'
import walletConnect from './wallet-icons/wallet-connect.svg'
import wallet from './wallet.svg'
import warning from './warning.svg'
import xCircle from './x-circle.svg'

export const assets = {
  sparkLogo,
  sparkIcon,
  lifiLogo,
  chevronDown,
  sliderThumb,
  circleInfo,
  up,
  down,
  success,
  wallet,
  link,
  threeDots,
  arrowRight,
  warning,
  pause,
  snowflake,
  xCircle,
  checkCircle,
  flash,
  greenArrowUp,
  boxArrowTopRight,
  magicWand,
  moreIcon,
  eye,
  menu,
  close,
  makerLogo,
  markets: {
    chart,
    inputOutput,
    lock,
    output,
  },
  actions: {
    approve,
    done,
    borrow,
    deposit,
    withdraw,
    repay,
    exchange,
  },
  chain: {
    gnosis,
    ethereum,
    unknown,
  },
  token: {
    dai,
    eth,
    gno,
    mkr,
    reth,
    sdai,
    steth,
    usdc,
    usdt,
    wbtc,
    weth,
    wsteth,
    wxdai,
    xdai,
    eure,
    weeth,
    unknown,
  },
  walletIcons: {
    coinbase,
    enjin,
    metamask,
    torus,
    walletConnect,
    default: defaultWallet,
  },
}

export function getTokenImage(symbol: TokenSymbol): string {
  const image = assets.token[symbol.toLocaleLowerCase() as keyof typeof assets.token]
  if (!image) {
    return assets.token.unknown
  }

  return image
}

export const tokenColors: Record<string, string> = {
  DAI: '#FFC046',
  ETH: '#7CC0FF',
  stETH: '#8F92EC',
  USDC: '#3392F8',
  sDAI: '#35B552',
  rETH: '#FF977D',
  MKR: '#1AAB9B',
  USDT: '#26A17B',
  WBTC: '#F09242',
  WETH: '#86A8EF',
  wstETH: '#00A3FF',
  WXDAI: '#FDB11F',
  XDAI: '#FFC046',
  GNO: '#3E6957',
  EURe: '#0086C2',
}
