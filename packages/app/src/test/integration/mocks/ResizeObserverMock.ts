// @ts-nocheck
/* eslint-disable */
// https://github.com/radix-ui/primitives/issues/420#issuecomment-771615182
window.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }])
  }
  unobserve() {}
}
