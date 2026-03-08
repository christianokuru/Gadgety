// Product categories
export const CATEGORIES = [
  'Phones',
  'Earbuds',
  'Power Banks',
  'Chargers',
  'Smart Watches',
  'Laptop Accessories',
] as const

export type Category = (typeof CATEGORIES)[number]

// Product brands
export const BRANDS = [
  'Apple',
  'Samsung',
  'Anker',
  'Oraimo',
  'Xiaomi',
  'Sony',
] as const

export type Brand = (typeof BRANDS)[number]

// Nigerian states
export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
] as const

export type NigerianState = (typeof NIGERIAN_STATES)[number]

// Filter types for products page
export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  page?: number
}

// Cart types
export interface CartItem {
  productId: string
  name: string
  price: number // in kobo
  quantity: number
  imageUrl: string | null
  slug: string
}

export interface Cart {
  items: CartItem[]
  total: number // in kobo
}
