"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { transformMedusaProducts } from "@/lib/util/transform-products"
import { Product } from "@/types/template"
import { getCategoryByHandle } from "./categories"

// Lists products with pagination, filters, and sorting. Returns products and pagination info.
export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  // Merge fields to prevent override - ensure pricing fields are always included
  const defaultFields =
    "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*translations,*images,+thumbnail"
  const mergedFields = queryParams?.fields
    ? `${defaultFields},${queryParams.fields}`
    : defaultFields

  const { fields, ...restQueryParams } = queryParams || {}

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields: mergedFields,
          ...restQueryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

// Retrieves a single product by ID or handle with pricing information.
export const retrieveProduct = async ({
  id,
  handle,
  countryCode,
  regionId,
}: {
  id?: string
  handle?: string
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct | null> => {
  if (!id && !handle) {
    throw new Error("Product ID or handle is required")
  }

  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const queryParam = id ? { id: [id] } : { handle: [handle] }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      method: "GET",
      query: {
        ...queryParam,
        region_id: region?.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,*variants.images,+metadata,+tags,*translations,*images,+thumbnail",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ products }) => products[0] || null)
    .catch(() => null)
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}

/**
 * Fetch all products from Medusa and transform to template format
 */
export const getAllProducts = async ({
  countryCode,
  limit = 100,
}: {
  countryCode: string
  limit?: number
}): Promise<Product[]> => {
  const { response } = await listProducts({
    pageParam: 1,
    queryParams: { limit },
    countryCode,
  })

  return transformMedusaProducts(response.products)
}

/**
 * Fetch products by category handle and transform to template format
 */
export const getProductsByCategory = async ({
  categoryHandle,
  countryCode,
  limit = 100,
}: {
  categoryHandle: string
  countryCode: string
  limit?: number
}): Promise<Product[]> => {
  // Get category by handle
  const category = await getCategoryByHandle([categoryHandle])

  if (!category?.id) {
    return []
  }

  // Fetch products filtered by category
  const { response } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit,
      category_id: [category.id],
    },
    countryCode,
  })

  return transformMedusaProducts(response.products)
}
