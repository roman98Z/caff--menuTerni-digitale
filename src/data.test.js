import { describe, it, expect } from 'vitest'
import {
  categories,
  menuData,
  allergenIcons,
  dietaryIcons,
} from './data'

const allProducts = () =>
  Object.entries(menuData).flatMap(([categoryId, products]) =>
    products.map((product) => ({ categoryId, product }))
  )

describe('categories', () => {
  it('has unique ids', () => {
    const ids = categories.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('menuData <-> categories', () => {
  it('has exactly the same keys as category ids (no orphans, no missing)', () => {
    const categoryIds = new Set(categories.map((c) => c.id))
    const menuKeys = new Set(Object.keys(menuData))
    expect(menuKeys).toEqual(categoryIds)
  })
})

describe('products within each category', () => {
  it.each(Object.keys(menuData))(
    '%s: product ids are unique within the category',
    (categoryId) => {
      const ids = menuData[categoryId].map((p) => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  )
})

describe('product fields', () => {
  it('all products have a finite positive price', () => {
    const bad = allProducts().filter(
      ({ product }) =>
        typeof product.price !== 'number' ||
        !Number.isFinite(product.price) ||
        product.price <= 0
    )
    expect(bad).toEqual([])
  })

  it('all product images resolve under /images/', () => {
    const bad = allProducts().filter(
      ({ product }) =>
        typeof product.image !== 'string' ||
        !product.image.startsWith('/images/')
    )
    expect(bad).toEqual([])
  })
})

describe('allergens and dietary tags have matching icons', () => {
  it('every allergen string appears in allergenIcons', () => {
    const unknown = new Set()
    for (const { product } of allProducts()) {
      for (const allergen of product.allergens ?? []) {
        if (!(allergen in allergenIcons)) unknown.add(allergen)
      }
    }
    expect([...unknown]).toEqual([])
  })

  it('every dietary string appears in dietaryIcons', () => {
    const unknown = new Set()
    for (const { product } of allProducts()) {
      for (const tag of product.dietary ?? []) {
        if (!(tag in dietaryIcons)) unknown.add(tag)
      }
    }
    expect([...unknown]).toEqual([])
  })
})
