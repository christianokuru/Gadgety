import Link from 'next/link'
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react'
import { ProductGrid } from '@/components/products'
import { getProducts } from '@/lib/api/products'

export default async function Home() {
  // Get featured products (first 4)
  const { products: featuredProducts } = await getProducts({ page: 1 })

  const features = [
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'We deliver to all 36 states in Nigeria',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'All products are genuine and tested',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Reach us anytime via WhatsApp',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-(--border) bg-(--card)">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-(--foreground) sm:text-5xl">
              Quality Gadgets at Great Prices
            </h1>
            <p className="mb-8 text-lg text-(--muted-foreground)">
              Your one-stop shop for phones, earbuds, smart watches, and more.
              Genuine products, nationwide delivery.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-(--primary) px-3 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/80"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/2349059952426"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-(--border) bg-(--background) px-3 text-sm font-medium transition-colors hover:bg-(--muted) hover:text-(--foreground)"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-(--border)">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 rounded-full bg-(--muted) p-4">
                  <feature.icon className="h-6 w-6 text-(--foreground)" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-(--foreground)">
                  {feature.title}
                </h3>
                <p className="text-sm text-(--muted-foreground)">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-(--foreground)">
                Featured Products
              </h2>
              <p className="mt-1 text-(--muted-foreground)">
                Check out our latest arrivals
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-(--border) bg-(--background) px-2.5 text-sm font-medium transition-colors hover:bg-(--muted) hover:text-(--foreground)"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts.slice(0, 4)} />
          ) : (
            <div className="rounded-lg border border-(--border) bg-(--card) p-12 text-center">
              <p className="text-(--muted-foreground)">
                No products available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-(--card)">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-(--foreground)">
              Ready to Shop?
            </h2>
            <p className="mb-6 text-(--muted-foreground)">
              Browse our collection of quality gadgets and place your order today.
              We deliver nationwide!
            </p>
            <Link
              href="/products"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-(--primary) px-3 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/80"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
