import { describe, it, expect } from 'vitest'

describe('Sample Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test basic math operations', () => {
    expect(2 * 3).toBe(6)
    expect(10 / 2).toBe(5)
    expect(5 - 3).toBe(2)
  })

  it('should test string operations', () => {
    const str = 'Hello World'
    expect(str.toLowerCase()).toBe('hello world')
    expect(str.length).toBe(11)
    expect(str.includes('World')).toBe(true)
  })

  it('should test arrays', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr.length).toBe(5)
    expect(arr.includes(3)).toBe(true)
    expect(arr[0]).toBe(1)
  })

  it('should test objects', () => {
    const obj = { name: 'Test', age: 25 }
    expect(obj.name).toBe('Test')
    expect(obj.age).toBe(25)
    expect(Object.keys(obj)).toEqual(['name', 'age'])
  })
})
