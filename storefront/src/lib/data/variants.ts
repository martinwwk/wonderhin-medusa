"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { getAuthHeaders, getCacheOptions } from "./cookies"

// Retrieves a product variant by its ID.
export const retrieveVariant = async (
  variant_id: string,
  regionId?: string
): Promise<HttpTypes.StoreProductVariant | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions("variants")),
  }

  return await sdk.client
    .fetch<{ variant: HttpTypes.StoreProductVariant }>(
      `/store/product-variants/${variant_id}`,
      {
        method: "GET",
        query: {
          fields: "*calculated_price,*images",
          ...(regionId && { region_id: regionId }),
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ variant }) => variant)
    .catch(() => null)
}
