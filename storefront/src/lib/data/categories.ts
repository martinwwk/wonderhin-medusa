import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

/**
 * Fetch category media (images) for a specific category
 */
export const getCategoryMedia = async (categoryId: string) => {
  try {
    const response = await sdk.client.fetch<{ images: any[] }>(
      `/store/category-media/${categoryId}`,
      {
        cache: "force-cache",
      }
    )
    return response.images || []
  } catch (error) {
    console.error(`Error fetching category media for ${categoryId}:`, error)
    return []
  }
}

// Lists all product categories with optional query parameters.
export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

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
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

/**
 * List only top-level categories (no parent) with their full child hierarchy.
 * Uses parent_category_id=null and include_descendants_tree=true
 * per Medusa docs: https://docs.medusajs.com/resources/storefront-development/products/categories/nested-categories
 */
export const listTopLevelCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

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
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

// Gets a product category by its handle (path).
export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
