import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

/**
 * Fetch category media (images) for a specific category
 */
export const getCategoryMediaClient = async (categoryId: string) => {
  try {
    const response = await sdk.client.fetch<{ images: any[] }>(
      `/store/category-media/${categoryId}`,
      {
        cache: "no-store",
      }
    )
    return response.images || []
  } catch (error) {
    console.error(`Error fetching category media for ${categoryId}:`, error)
    return []
  }
}

/**
 * Client-side category fetching (no server-only dependencies)
 * Lists all product categories with optional query parameters.
 * 
 * Note: This function does not require regionId as categories are global
 */
export const listCategoriesClient = async (query?: Record<string, any>) => {
  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        cache: "no-store", // Client-side fetching shouldn't cache aggressively
      }
    )
    .then(({ product_categories }) => product_categories)
    .catch((error) => {
      console.error('Error fetching categories:', error)
      return [] // Return empty array on error to prevent crashes
    })
}

/**
 * Client-side: List only top-level categories with their full child hierarchy.
 * Uses parent_category_id=null and include_descendants_tree=true
 */
export const listTopLevelCategoriesClient = async (query?: Record<string, any>) => {
  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category",
          include_descendants_tree: true,
          parent_category_id: "null",
          limit,
          ...query,
        },
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => product_categories)
    .catch((error) => {
      console.error('Error fetching top-level categories:', error)
      return []
    })
}

/**
 * Gets a product category by its handle (path) on the client side
 */
export const getCategoryByHandleClient = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => product_categories[0])
    .catch((error) => {
      console.error(`Error fetching category by handle ${handle}:`, error)
      return null
    })
}
