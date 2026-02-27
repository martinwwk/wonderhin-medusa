import { HttpTypes } from "@medusajs/types"
import { Category } from "@/types/template"
import { getProxiedImageUrl } from "@/utils/image-proxy"

/**
 * Transform Medusa StoreProductCategory to template Category format
 */
export function transformMedusaCategory(
  medusaCategory: HttpTypes.StoreProductCategory,
  categoryMedia?: any[]
): Category {
  // Get thumbnail from category media API or fallback to metadata
  let thumbnailUrl: string | undefined
  
  if (categoryMedia && categoryMedia.length > 0) {
    // Find the thumbnail image from category media
    const thumbnail = categoryMedia.find(img => img.type === "thumbnail") || categoryMedia[0]
    thumbnailUrl = thumbnail?.url
  } else if (medusaCategory.metadata?.image) {
    thumbnailUrl = medusaCategory.metadata.image as string
  }

  // Apply image proxy for localhost URLs
  const proxiedThumbnail = thumbnailUrl ? getProxiedImageUrl(thumbnailUrl) : undefined

  return {
    id: medusaCategory.id as any,
    name: medusaCategory.name,
    slug: medusaCategory.handle || '',
    image: proxiedThumbnail
      ? {
          id: medusaCategory.id,
          thumbnail: proxiedThumbnail,
          original: proxiedThumbnail,
        }
      : undefined,
    children: medusaCategory.category_children?.map(c => transformMedusaCategory(c)) as [Category],
    products: medusaCategory.products as any,
    productCount: medusaCategory.products?.length || 0,
    description: medusaCategory.description,
    metadata: medusaCategory.metadata,
    // Map to match shared component expectations
    type: medusaCategory.metadata?.type as string | undefined,
  }
}

/**
 * Transform array of Medusa categories
 */
export function transformMedusaCategories(
  medusaCategories?: HttpTypes.StoreProductCategory[]
): Category[] {
  if (!medusaCategories) return []
  return medusaCategories.map(transformMedusaCategory)
}
