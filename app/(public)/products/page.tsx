import { Suspense } from 'react'
import { ProductGrid, ProductFilters, MobileFilterDrawer } from '@/components/products'
import { ProductPagination } from '@/components/products/product-pagination'
import { getProducts } from '@/lib/api/products'
import type { ProductFilters as FilterType } from '@/types'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    brand?: string
    min?: string
    max?: string
    inStock?: string
    page?: string
  }>
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams

  const filters: FilterType = {
    category: params.category,
    brand: params.brand,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    inStock: params.inStock === 'true',
    page: params.page ? Number(params.page) : 1,
  }

  const { products, totalCount } = await getProducts(filters)
  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--foreground)">Products</h1>
        <p className="mt-1 text-(--muted-foreground)">
          {totalCount} {totalCount === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-lg border border-(--border) bg-(--card) p-6">
            <ProductFilters currentFilters={filters} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filter Button */}
          <div className="mb-4 flex items-center justify-between">
            <MobileFilterDrawer currentFilters={filters} />
          </div>

          <ProductGrid products={products} />

          <ProductPagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
          />
        </main>
      </div>
    </div>
  )
}

export default async function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-9 w-32 animate-pulse rounded bg-(--muted)" />
            <div className="mt-1 h-5 w-48 animate-pulse rounded bg-(--muted)" />
          </div>
          <div className="flex gap-8">
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="h-96 animate-pulse rounded-lg bg-(--muted)" />
            </aside>
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-lg bg-(--muted)"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  )
}
