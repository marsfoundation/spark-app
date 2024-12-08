import { PublicInterface } from '@marsfoundation/common-universal'
import { Tracer } from './Tracer'

export function TracerMock(): Tracer {
  return new TracerMockClass() as any
}

class TracerMockClass implements PublicInterface<Tracer> {
  for(_object: {} | string): Tracer {
    return this as any
  }

  async track<T>(_name: string, fn: () => T): Promise<T> {
    return fn()
  }
}
