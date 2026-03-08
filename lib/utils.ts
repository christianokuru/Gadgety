import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price from kobo to Naira with currency symbol
 * @param priceInKobo - Price in kobo (e.g., 15000000 for ₦150,000)
 * @returns Formatted price string (e.g., "₦150,000")
 */
export function formatPrice(priceInKobo: number): string {
  const priceInNaira = priceInKobo / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInNaira)
}

/**
 * Format price from kobo to Naira without currency symbol
 * @param priceInKobo - Price in kobo
 * @returns Formatted price string without symbol (e.g., "150,000")
 */
export function formatPriceNoSymbol(priceInKobo: number): string {
  const priceInNaira = priceInKobo / 100
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInNaira)
}

/**
 * Convert Naira to kobo for storage
 * @param priceInNaira - Price in Naira
 * @returns Price in kobo
 */
export function toKobo(priceInNaira: number): number {
  return Math.round(priceInNaira * 100)
}

/**
 * Generate a slug from a string
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate WhatsApp order link
 * @param productName - Name of the product
 * @returns WhatsApp URL with prefilled message
 */
export function getWhatsAppLink(productName: string): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349059952426'
  const message = encodeURIComponent(`Hello, I want to buy the ${productName} from your website.`)
  return `https://wa.me/${phoneNumber}?text=${message}`
}
