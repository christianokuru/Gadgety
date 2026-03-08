'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, BRANDS, type ProductFilters } from '@/types'
import { formatPriceNoSymbol } from '@/lib/utils'

interface ProductFiltersProps {
  currentFilters: ProductFilters
}

export function ProductFilters({ currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = useCallback(
    (updates: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Handle each filter type
      if (updates.category !== undefined) {
        if (updates.category) {
          params.set('category', updates.category)
        } else {
          params.delete('category')
        }
      }

      if (updates.brand !== undefined) {
        if (updates.brand) {
          params.set('brand', updates.brand)
        } else {
          params.delete('brand')
        }
      }

      if (updates.minPrice !== undefined) {
        if (updates.minPrice) {
          params.set('min', String(updates.minPrice * 100)) // Convert to kobo
        } else {
          params.delete('min')
        }
      }

      if (updates.maxPrice !== undefined) {
        if (updates.maxPrice) {
          params.set('max', String(updates.maxPrice * 100)) // Convert to kobo
        } else {
          params.delete('max')
        }
      }

      if (updates.inStock !== undefined) {
        if (updates.inStock) {
          params.set('inStock', 'true')
        } else {
          params.delete('inStock')
        }
      }

      // Reset to page 1 when filters change
      params.delete('page')

      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push('/products')
  }, [router])

  const hasActiveFilters =
    currentFilters.category ||
    currentFilters.brand ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    currentFilters.inStock

  // Convert kobo to naira for display
  const minPriceDisplay = currentFilters.minPrice ? currentFilters.minPrice / 100 : ''
  const maxPriceDisplay = currentFilters.maxPrice ? currentFilters.maxPrice / 100 : ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--foreground)">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-(--muted-foreground) hover:text-(--foreground)"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-(--foreground)">Category</Label>
        <Select
          value={currentFilters.category || ''}
          onValueChange={(value) => updateFilters({ category: value || undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-(--foreground)">Brand</Label>
        <Select
          value={currentFilters.brand || ''}
          onValueChange={(value) => updateFilters({ brand: value || undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Brands</SelectItem>
            {BRANDS.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-(--foreground)">
          Price Range (₦)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPriceDisplay || ''}
            onChange={(e) =>
              updateFilters({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full"
          />
          <span className="text-(--muted-foreground)">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPriceDisplay || ''}
            onChange={(e) =>
              updateFilters({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full"
          />
        </div>
      </div>

      {/* In Stock Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={currentFilters.inStock || false}
            onCheckedChange={(checked) =>
              updateFilters({ inStock: checked === true ? true : undefined })
            }
          />
          <Label
            htmlFor="inStock"
            className="text-sm font-normal text-(--foreground) cursor-pointer"
          >
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  )
}
