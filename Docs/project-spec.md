# Gadgets E-Commerce Website - Project Specification

> A production-ready gadget e-commerce website for selling physical gadgets.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Payments | Paystack (test mode → live on deploy) |
| Deployment | Vercel |

---

## Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# App Config
WHATSAPP_NUMBER=2349059952426
```

---

## Currency

- **Currency**: Nigerian Naira (NGN)
- **Symbol**: ₦
- **Display format**: ₦{price} (e.g., ₦150,000)

---

## Database Schema

### Tables

#### `products`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| slug | text | URL-friendly identifier (unique) |
| description | text | Product description |
| price | integer | Price in kobo/cents (avoid floating point) |
| brand | text | Brand name |
| category | text | Category name |
| stock | integer | Available quantity |
| image_url | text | Main product image URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

#### `orders`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| customer_name | text | Full name |
| phone | text | Phone number |
| address | text | Street address |
| state | text | Nigerian state |
| city | text | City |
| total_price | integer | Total order amount in kobo |
| payment_status | text | 'pending' | 'paid' | 'failed' |
| payment_reference | text | Paystack transaction reference |
| created_at | timestamp | Order timestamp |

#### `order_items`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| order_id | uuid | Foreign key to orders |
| product_id | uuid | Foreign key to products |
| quantity | integer | Quantity ordered |
| price | integer | Price at time of order (in kobo) |

#### `profiles` (extends Supabase auth.users)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users.id) |
| email | text | User email |
| full_name | text | Full name |
| role | text | 'customer' | 'admin' |
| created_at | timestamp | Creation timestamp |

---

## Product Categories

- Phones
- Earbuds
- Power Banks
- Chargers
- Smart Watches
- Laptop Accessories

---

## Product Brands

- Apple
- Samsung
- Anker
- Oraimo
- Xiaomi
- Sony
- (More can be added via admin)

---

## Nigerian States (for delivery dropdown)

```json
[
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]
```

---

## Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage | No |
| `/products` | Product catalog with filters | No |
| `/product/[slug]` | Product detail page | No |
| `/cart` | Shopping cart | No |
| `/checkout` | Checkout form + payment | No |
| `/orders` | Order confirmation/history | No |
| `/admin` | Admin dashboard | Yes (admin role) |
| `/admin/products` | Product management | Yes (admin role) |
| `/admin/orders` | Order management | Yes (admin role) |

---

## Features

### 1. Product Catalog (`/products`)

- Product grid layout with cards
- Each card shows: image, name, price, "Add to Cart" button
- Pagination or infinite scroll

### 2. Product Filters (sidebar)

Filters update product list dynamically and via URL query params:

- **Category filter**: Phones, Earbuds, Power Banks, Chargers, Smart Watches, Laptop Accessories
- **Brand filter**: Apple, Samsung, Anker, Oraimo, Xiaomi, Sony
- **Price filter**: Min/max inputs or range slider
- **Availability filter**: "In stock only" checkbox

URL format: `/products?category=phones&brand=apple&min=100000&max=500000&inStock=true`

### 3. Product Detail Page (`/product/[slug]`)

- Large product image(s)
- Product name, price, description, brand
- Stock status
- "Add to Cart" button (disabled if out of stock)
- "Order on WhatsApp" button

### 4. Cart System

- Stored in localStorage + React Context/Zustand
- Add/remove products
- Update quantities
- Calculate totals
- Persist across sessions

### 5. Checkout Flow

1. Customer fills form: full name, phone, address, state, city
2. Clicks "Pay Now" → redirected to Paystack
3. Completes payment → redirected back
4. Paystack webhook confirms payment
5. Order created in database
6. Product stock reduced

### 6. Paystack Integration

- Test mode for development
- Live mode for production
- Webhook endpoint for payment confirmation
- Transaction verification on backend

### 7. Orders System

- Orders stored in `orders` table
- Order items stored in `order_items` table
- Payment status tracked: pending → paid/failed
- Stock automatically reduced on successful payment

### 8. Admin Dashboard (`/admin`)

Protected route - only users with `role = 'admin'` can access.

Features:
- Add new products
- Edit existing products
- Delete products
- Update stock levels
- Upload product images (to Supabase Storage)
- View and manage orders
- Low stock warning (stock < 5)

### 9. Inventory System

- Each product tracks `stock` count
- Stock = 0 → "Out of Stock", Add to Cart disabled
- Stock < 5 → Warning displayed in admin

### 10. WhatsApp Ordering

Alternative purchase option.

- Button: "Order on WhatsApp"
- Opens: `https://wa.me/2349059952426`
- Prefilled message: "Hello, I want to buy the [product name] from your website."

---

## Authentication & Authorization

### User Roles

| Role | Permissions |
|------|-------------|
| customer | Browse products, place orders |
| admin | Full admin dashboard access |

### Flow

1. User signs up via Supabase Auth → automatically assigned `customer` role
2. Admin manually updates user role to `admin` in database
3. Role checked on protected routes

---

## UI/UX Design

- **Style**: Modern, minimal, Apple-inspired aesthetic
- **Color scheme**: Clean whites/grays with accent colors
- **Layout**: Left sidebar filters, right side product grid
- **Responsive**: Mobile, tablet, desktop breakpoints
- **Components**: Use Shadcn/ui components

---

## Project Structure

```
gadgets/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx          # Product catalog
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product detail
│   │   ├── cart/
│   │   │   └── page.tsx          # Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx          # Checkout page
│   │   └── orders/
│   │       └── page.tsx          # Order confirmation
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx        # Admin layout with auth
│   │       ├── page.tsx          # Admin dashboard
│   │       ├── products/
│   │       │   └── page.tsx      # Product management
│   │       └── orders/
│   │           └── page.tsx      # Order management
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts          # Products API
│   │   ├── orders/
│   │   │   └── route.ts          # Orders API
│   │   └── webhooks/
│   │       └── paystack/
│   │           └── route.ts      # Paystack webhook
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Shadcn/ui components
│   ├── products/
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   └── product-filters.tsx
│   ├── cart/
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── checkout/
│   │   └── checkout-form.tsx
│   └── layout/
│       ├── header.tsx
│       ├── footer.tsx
│       └── sidebar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Admin client (service role)
│   ├── paystack.ts               # Paystack utilities
│   └── utils.ts                  # General utilities
├── hooks/
│   ├── use-cart.ts               # Cart state management
│   └── use-auth.ts               # Auth state management
├── types/
│   ├── database.ts               # Database types
│   └── index.ts                  # Shared types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
│   └── images/
├── Docs/
│   └── project-spec.md           # This file
└── .env.local                    # Environment variables
```

---

## Implementation Priority

1. **Phase 1**: Database schema, Supabase setup, Products page with filters
2. **Phase 2**: Product detail page, Cart system
3. **Phase 3**: Checkout, Paystack integration
4. **Phase 4**: Admin dashboard
5. **Phase 5**: Polish, testing, deployment

---

## Notes

- Use server components where appropriate (SEO, initial page loads)
- Use client components for interactive elements (filters, cart)
- All prices stored as integers (kobo) to avoid floating point issues
- Validate all user input on both client and server
- Handle edge cases: out of stock during checkout, payment failures
