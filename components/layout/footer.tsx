import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-(--border) bg-(--card)">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-(--foreground)">Gadgets</h3>
            <p className="text-sm text-(--muted-foreground)">
              Your one-stop shop for quality gadgets and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-(--foreground)">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-(--foreground)">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=Phones"
                  className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
                >
                  Phones
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Earbuds"
                  className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
                >
                  Earbuds
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Smart+Watches"
                  className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
                >
                  Smart Watches
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-(--foreground)">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/2349059952426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-(--border) pt-8 text-center">
          <p className="text-sm text-(--muted-foreground)">
            &copy; {currentYear} Gadgets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
