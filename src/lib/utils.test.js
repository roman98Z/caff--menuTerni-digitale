import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins string arguments with a single space', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('dedupes conflicting tailwind classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('drops falsy values from clsx (false, null, undefined)', () => {
    const enabled = false
    expect(cn('a', enabled && 'b', null, undefined, 'c')).toBe('a c')
  })

  it('accepts arrays and objects like clsx does', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c')
  })
})
