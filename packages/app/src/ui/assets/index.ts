import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { Percentage } from '@/domain/types/NumericValues'
import approve from './actions/approve.svg'
import borrow from './actions/borrow.svg'
import deposit from './actions/deposit.svg'
import done from './actions/done.svg'
import exchange from './actions/exchange.svg'
import repay from './actions/repay.svg'
import withdraw from './actions/withdraw.svg'
import arrowRight from './arrow-right.svg'
import arrowUpRight from './arrow-up-right.svg'
import upgradeBannerBg from './banners/upgrade-banner-bg.svg'
import boxArrowTopRight from './box-arrow-top-right.svg'
import ethereum from './chains/ethereum.svg'
import gnosis from './chains/gnosis.svg'
import checkCircle from './check-circle.svg'
import chevronDown from './chevron-down.svg'
import circleInfo from './circle-info.svg'
import closeFilled from './close-filled.svg'
import close from './close.svg'
import down from './down.svg'
import downgrade from './downgrade.svg'
import eye from './eye.svg'
import flash from './flash.svg'
import giftbox from './giftbox.svg'
import greenArrowUp from './green-arrow-up.svg'
import lifiLogo from './lifi-logo.svg'
import link from './link.svg'
import magicWandCircle from './magic-wand-circle.svg'
import magicWand from './magic-wand.svg'
import makerLogo from './maker.svg'
import chart from './markets/chart.svg'
import inputOutput from './markets/input-output.svg'
import lock from './markets/lock.svg'
import output from './markets/output.svg'
import menu from './menu.svg'
import moreIconVertical from './more-icon-vertical.svg'
import moreIcon from './more-icon.svg'
import pause from './pause.svg'
import rocket from './rocket.svg'
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
import ngt from './tokens/ngt.svg'
import nst from './tokens/nst.svg'
import reth from './tokens/reth.svg'
import sdai from './tokens/sdai.svg'
import snst from './tokens/snst.svg'
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
import upgrade from './upgrade.svg'
import coinbase from './wallet-icons/coinbase.svg'
import defaultWallet from './wallet-icons/default.svg'
import enjin from './wallet-icons/enjin.svg'
import metamask from './wallet-icons/metamask.svg'
import torus from './wallet-icons/torus.svg'
import walletConnect from './wallet-icons/wallet-connect.svg'
import wallet from './wallet.svg'
import warning from './warning.svg'
import xCircle from './x-circle.svg'
import timer from './timer.svg'

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
  arrowUpRight,
  warning,
  pause,
  snowflake,
  xCircle,
  checkCircle,
  flash,
  greenArrowUp,
  boxArrowTopRight,
  magicWand,
  magicWandCircle,
  moreIcon,
  moreIconVertical,
  eye,
  menu,
  close,
  closeFilled,
  makerLogo,
  giftbox,
  rocket,
  downgrade,
  timer,
  markets: {
    chart,
    inputOutput,
    lock,
    output,
  },
  actions: {
    upgrade,
    downgrade,
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
    eure,
    gno,
    mkr,
    ngt,
    nst,
    reth,
    sdai,
    snst,
    steth,
    usdc,
    'usdc.e': usdc,
    usdt,
    wbtc,
    weeth,
    weth,
    wsteth,
    wxdai,
    xdai,
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
  banners: {
    upgradeBannerBg,
  },
}

export function getTokenImage(symbol: TokenSymbol): string {
  const image = assets.token[symbol.toLocaleLowerCase() as keyof typeof assets.token]
  if (!image) {
    return assets.token.unknown
  }

  return image
}

export function getTokenColor(symbol: TokenSymbol, options?: { alpha?: Percentage; fallback?: string }): string {
  const color = tokenColors[symbol]
  const alpha = (options?.alpha ?? Percentage(1)).toFixed(2)
  const fallback = options?.fallback ?? `rgb(217 217 217 / ${alpha})`

  return color ? `rgb(${color} / ${alpha})` : fallback
}

const tokenColors: Record<TokenSymbol, `${number} ${number} ${number}`> = {
  [TokenSymbol('DAI')]: '255 192 70',
  [TokenSymbol('ETH')]: '124 192 255',
  [TokenSymbol('EURe')]: '0 134 194',
  [TokenSymbol('GNO')]: '62 105 87',
  [TokenSymbol('MKR')]: '26 171 155',
  [TokenSymbol('NGT')]: '178 104 252',
  [TokenSymbol('NST')]: '255 192 70',
  [TokenSymbol('rETH')]: '255 151 125',
  [TokenSymbol('sDAI')]: '53 181 82',
  [TokenSymbol('sNST')]: '53 181 82',
  [TokenSymbol('stETH')]: '143 146 236',
  [TokenSymbol('USDC')]: '51 146 248',
  [TokenSymbol('USDC.e')]: '51 146 248',
  [TokenSymbol('USDT')]: '38 161 123',
  [TokenSymbol('WBTC')]: '240 146 66',
  [TokenSymbol('weETH')]: '90 68 190',
  [TokenSymbol('WETH')]: '134 168 239',
  [TokenSymbol('wstETH')]: '0 163 255',
  [TokenSymbol('WXDAI')]: '253 177 31',
  [TokenSymbol('XDAI')]: '255 192 70',
}
