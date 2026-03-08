export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number // stored in kobo (cents)
          brand: string
          category: string
          stock: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          price: number
          brand: string
          category: string
          stock?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          brand?: string
          category?: string
          stock?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          phone: string
          address: string
          state: string
          city: string
          total_price: number // stored in kobo
          payment_status: 'pending' | 'paid' | 'failed'
          payment_reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          phone: string
          address: string
          state: string
          city: string
          total_price: number
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          phone?: string
          address?: string
          state?: string
          city?: string
          total_price?: number
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_reference?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number // stored in kobo
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_status: 'pending' | 'paid' | 'failed'
      user_role: 'customer' | 'admin'
    }
  }
}

// Convenience types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Order with items (for display purposes)
export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[]
}
