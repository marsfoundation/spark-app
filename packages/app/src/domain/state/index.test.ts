import { create } from 'zustand'

import { ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY } from '@/config/consts'
import { makeFunctionsComparisonStable } from '@/test/integration/object-utils'

import { storeImplementation, StoreState } from '.'

describe(storeImplementation.name, () => {
  afterEach(() => localStorage.clear())

  it('initializes store', () => {
    const store = create(storeImplementation)
    expect(store.getState()).toMatchSnapshot()
  })

  it('persists state', () => {
    expect(localStorage.getItem(ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY)).toBeNull()

    const store = create(storeImplementation)
    store.setState((s) => s) // triggers state persistence into local storage

    expect(JSON.parse(localStorage.getItem(ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY) as any)).toMatchSnapshot()
  })

  it('deserializes initial state back from the local storage', () => {
    expect(localStorage.getItem(ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY)).toBeNull()

    let expectedState: StoreState
    {
      const store = create(storeImplementation)
      expectedState = store.getState() // extract initial state which should be always fully correct
      store.setState(() => ({})) // triggers state persistence into local storage
    }

    // seconds store creation should deserialize persisted state from local storage
    expect(localStorage.getItem(ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY)).not.toBeNull()
    const store = create(storeImplementation)
    const stateDeserializedFromLocalStorage = store.getState()

    expect(makeFunctionsComparisonStable(stateDeserializedFromLocalStorage)).toEqual(
      makeFunctionsComparisonStable(expectedState),
    )
  })

  it('deserializes sandbox slice correctly', () => {
    expect(localStorage.getItem(ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY)).toBeNull()

    let expectedState: StoreState
    {
      const store = create(storeImplementation)
      store.setState((s) => ({
        sandbox: {
          ...s.sandbox,

          network: {
            name: 'name',
            forkUrl: 'forkUrl',
            originChainId: 1,
            forkChainId: 2,
            createdAt: new Date(),
            ephemeralAccountPrivateKey: '0x123',
          },
        },
      })) // triggers state persistence into local storage
      expectedState = store.getState() // extract whole state which should be always fully correct
    }

    // seconds store creation should deserialize persisted state from local storage
    expect(localStorage.getItem(ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY)).not.toBeNull()
    const store = create(storeImplementation)
    const stateDeserializedFromLocalStorage = store.getState()

    expect(makeFunctionsComparisonStable(stateDeserializedFromLocalStorage)).toEqual(
      makeFunctionsComparisonStable(expectedState),
    )
  })
})
