import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

  // Optionally filter by category_ids query param
  const categoryIds = req.query.category_ids
    ? (req.query.category_ids as string).split(",")
    : undefined

  const filters: Record<string, unknown> = {}
  if (categoryIds) {
    filters.id = categoryIds
  }

  const { data } = await query.graph({
    entity: "product_category",
    fields: ["id", "category_images.*"],
    filters,
  })

  // Build a map of category_id -> images
  const categoryImages: Record<string, unknown[]> = {}
  for (const cat of data || []) {
    categoryImages[cat.id] = (cat as any).category_images || []
  }

  res.json({ category_images: categoryImages })
}
