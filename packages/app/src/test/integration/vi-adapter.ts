const _stubsGlobal = new Map<string | symbol | number, PropertyDescriptor | undefined>()

function stubGlobal(name: string | symbol | number, value: any) {
  if (!_stubsGlobal.has(name))
    _stubsGlobal.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  })
}

function unstubAllGlobals() {
  _stubsGlobal.forEach((original, name) => {
    if (!original)
      Reflect.deleteProperty(globalThis, name)
    else
      Object.defineProperty(globalThis, name, original)
  })
  _stubsGlobal.clear()
}

export const vi = {
  stubGlobal,
  unstubAllGlobals,
}