'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/database'

interface ProductQuantityClientProps {
  product: Product
}

export function ProductQuantityClient({ product }: ProductQuantityClientProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const inStock = product.stock > 0
  const maxQuantity = Math.min(quantity + 1, product.stock)

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1))
  }

  const incrementQuantity = () => {
    setQuantity((q) => Math.min(q + 1, product.stock))
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
      quantity,
    })
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-(--foreground)">Quantity:</span>
        <div className="flex items-center rounded-lg border border-(--border)">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || !inStock}
            className="h-10 w-10 rounded-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock || !inStock}
            className="h-10 w-10 rounded-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-(--muted-foreground)">Total:</span>
        <span className="text-xl font-bold text-(--foreground)">
          {formatPrice(product.price * quantity)}
        </span>
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={!inStock}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  )
}
