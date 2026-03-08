'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const inStock = product.stock > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!inStock) return

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
    })
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group h-full overflow-hidden border border-(--border) bg-(--card) transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-(--muted)">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-(--muted-foreground)">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}

          {inStock && product.stock < 5 && (
            <Badge className="absolute right-2 top-2 bg-amber-500">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-1 text-xs text-(--muted-foreground)">
            {product.brand}
          </div>
          <h3 className="mb-2 line-clamp-2 font-medium text-(--foreground)">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-(--foreground)">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="shrink-0"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
