import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, MessageCircle, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from '@/components/products'
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { ProductQuantityClient } from './client'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category)
  const inStock = product.stock > 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="mb-6 inline-flex items-center text-sm text-(--muted-foreground) hover:text-(--foreground)"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      {/* Product Details */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg border border-(--border) bg-(--muted)">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-(--muted-foreground)">
              <ShoppingCart className="h-24 w-24" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-(--foreground)">
            {product.name}
          </h1>

          <p className="mb-4 text-2xl font-bold text-(--foreground)">
            {formatPrice(product.price)}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            {inStock ? (
              product.stock < 5 ? (
                <Badge className="bg-amber-500">
                  Only {product.stock} left in stock
                </Badge>
              ) : (
                <Badge className="bg-green-500">In Stock</Badge>
              )
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-(--foreground)">
              Description
            </h2>
            <p className="whitespace-pre-line text-(--muted-foreground)">
              {product.description || 'No description available.'}
            </p>
          </div>

          {/* Product Details */}
          <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-(--border) p-4">
            <div>
              <p className="text-sm text-(--muted-foreground)">Category</p>
              <p className="font-medium text-(--foreground)">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-(--muted-foreground)">Brand</p>
              <p className="font-medium text-(--foreground)">{product.brand}</p>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mt-auto space-y-4">
            <ProductQuantityClient product={product} />

            {/* WhatsApp Order Button */}
            <a
              href={getWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-(--border) bg-(--background) px-2.5 py-2 text-sm font-medium transition-colors hover:bg-(--muted) hover:text-(--foreground)"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-(--foreground)">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
