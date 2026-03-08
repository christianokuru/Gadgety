import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/database'
import type { ProductFilters } from '@/types'

interface GetProductsResult {
  products: Product[]
  totalCount: number
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<GetProductsResult> {
  const supabase = await createClient()

  const ITEMS_PER_PAGE = 12
  const page = filters.page || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.brand) {
    query = query.eq('brand', filters.brand)
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters.inStock) {
    query = query.gt('stock', 0)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], totalCount: 0 }
  }

  return {
    products: data || [],
    totalCount: count || 0,
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', productId)
    .gt('stock', 0)
    .limit(limit)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return data || []
}
