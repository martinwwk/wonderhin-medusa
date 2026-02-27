import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

/**
 * Client-side product fetching (no server-only dependencies)
 * Lists all products with optional query parameters.
 */
export const listProductsClient = async ({
  queryParams,
  regionId,
}: {
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  regionId: string
}): Promise<HttpTypes.StoreProduct[]> => {
  const limit = queryParams?.limit || 12

  const defaultFields =
    "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*translations,*images,+thumbnail"

  const { fields, ...restQueryParams } = queryParams || {}

  const mergedFields = fields
    ? `${defaultFields},${fields}`
    : defaultFields

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          region_id: regionId,
          fields: mergedFields,
          ...restQueryParams,
        },
        cache: "no-store", // Client-side fetching shouldn't cache aggressively
      }
    )
    .then(({ products }: { products: HttpTypes.StoreProduct[] }) => products)
    .catch((error) => {
      console.error('Error fetching products:', error)
      return [] // Return empty array on error to prevent crashes
    })
}

/**
 * Lists products with pagination support on the client side
 */
export const listProductsWithPaginationClient = async ({
  pageParam = 1,
  queryParams,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  regionId: string
}): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
  nextPage: number | null
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  const defaultFields =
    "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*translations,*images,+thumbnail"

  const { fields, ...restQueryParams } = queryParams || {}

  const mergedFields = fields
    ? `${defaultFields},${fields}`
    : defaultFields

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: regionId,
          fields: mergedFields,
          ...restQueryParams,
        },
        cache: "no-store",
      }
    )
    .then(({ products, count }: { products: HttpTypes.StoreProduct[]; count: number }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        products,
        count,
        nextPage,
      }
    })
    .catch((error) => {
      console.error('Error fetching products with pagination:', error)
      return {
        products: [],
        count: 0,
        nextPage: null,
      }
    })
}

/**
 * Retrieves a single product by handle on the client side
 */
export const retrieveProductClient = async ({
  handle,
  regionId,
}: {
  handle: string
  regionId: string
}): Promise<HttpTypes.StoreProduct | null> => {
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      method: "GET",
      query: {
        handle: [handle],
        region_id: regionId,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*translations,*images,+thumbnail",
      },
      cache: "no-store",
    })
    .then(({ products }: { products: HttpTypes.StoreProduct[] }) => products[0] || null)
    .catch(() => null)
}
