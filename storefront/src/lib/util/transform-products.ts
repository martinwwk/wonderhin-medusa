import { HttpTypes } from "@medusajs/types"
import { Product, Attachment, VariationOption } from "@/types/template"
import { getProxiedImageUrl } from "@/utils/image-proxy"

/**
 * Get the cheapest variant price for a product
 */
function getCheapestPrice(variants?: HttpTypes.StoreProductVariant[] | null): {
  price: number
  salePrice?: number
  minPrice?: number
  maxPrice?: number
} {
  if (!variants || variants.length === 0) {
    return { price: 0 }
  }

  const prices = variants
    .map((v) => v.calculated_price?.calculated_amount || 0)
    .filter((p) => p > 0)

  if (prices.length === 0) {
    return { price: 0 }
  }

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  return {
    price: minPrice,
    minPrice: minPrice,
    maxPrice: maxPrice !== minPrice ? maxPrice : undefined,
  }
}

/**
 * Transform Medusa StoreProduct to template Product format
 */
export function transformMedusaProduct(
  medusaProduct: HttpTypes.StoreProduct
): Product {
  const pricing = getCheapestPrice(medusaProduct.variants)
  
  // Get the best available image - try thumbnail first, then first image, then placeholder
  const thumbnailUrl = getProxiedImageUrl(
    medusaProduct.thumbnail 
    || medusaProduct.images?.[0]?.url 
    || "/assets/placeholder.png"
  )
  
  // Main product image
  const mainImage: Attachment = {
    id: medusaProduct.id,
    thumbnail: thumbnailUrl,
    original: thumbnailUrl,
  }

  // Gallery images - include all images from the product
  const gallery: Attachment[] = medusaProduct.images?.map((img, idx) => ({
    id: `${medusaProduct.id}-${idx}`,
    thumbnail: getProxiedImageUrl(img.url),
    original: getProxiedImageUrl(img.url),
  })) || []
  
  // If no gallery images but we have a thumbnail, use it
  const finalGallery = gallery.length > 0 ? gallery : [mainImage]

  // Transform variants to variation options
  const variationOptions: VariationOption[] = medusaProduct.variants?.map((variant, idx) => {
    // Get first image from variant's image collection or fallback to main image
    const variantImage = variant.images?.[0]?.url;
    
    return {
      id: idx,
      title: variant.title || "",
      price: variant.calculated_price?.calculated_amount || 0,
      sale_price: variant.calculated_price?.original_amount || 0,
      quantity: variant.inventory_quantity || 0,
      is_disable: (variant.inventory_quantity || 0) <= 0 ? 1 : 0,
      image: variantImage ? {
        id: variant.id,
        thumbnail: getProxiedImageUrl(variantImage),
        original: getProxiedImageUrl(variantImage),
      } : mainImage,
      sku: variant.sku || "",
      options: variant.options?.map((opt) => ({
        name: opt.option?.title || "",
        value: opt.value || "",
      })) || [],
    };
  }) || []

  return {
    id: medusaProduct.id,
    name: medusaProduct.title || "",
    slug: medusaProduct.handle || "",
    price: pricing.price,
    sale_price: pricing.salePrice,
    min_price: pricing.minPrice,
    max_price: pricing.maxPrice,
    quantity: medusaProduct.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) || 0,
    sold: 0, // Medusa doesn't track this by default
    videoUrl: (medusaProduct.metadata?.videoUrl as string) || "",
    image: mainImage,
    gallery: finalGallery,
    sku: medusaProduct.variants?.[0]?.sku || "",
    description: medusaProduct.description || "",
    brand: (medusaProduct.metadata?.brand as string) || "",
    unit: (medusaProduct.metadata?.unit as string) || "",
    model: (medusaProduct.metadata?.model as string) || "",
    rating: (medusaProduct.metadata?.rating as number) || 0,
    discountPercentage: (medusaProduct.metadata?.discountPercentage as number) || 0,
    weight: (medusaProduct.metadata?.weight as number) || 0,
    variation_options: variationOptions,
    tag: medusaProduct.tags?.map((tag) => ({
      id: tag.id,
      name: tag.value,
      slug: tag.value.toLowerCase().replace(/\s+/g, "-"),
    })) || [],
    // Pass through metadata for additional fields
    metadata: medusaProduct.metadata,
    status: medusaProduct.status,
    material: medusaProduct.material,
    categories: medusaProduct.categories,
  }
}

/**
 * Transform array of Medusa products
 */
export function transformMedusaProducts(
  medusaProducts?: HttpTypes.StoreProduct[]
): Product[] {
  if (!medusaProducts) return []
  return medusaProducts.map(transformMedusaProduct)
}
