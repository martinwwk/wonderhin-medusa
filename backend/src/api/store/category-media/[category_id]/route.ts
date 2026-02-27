import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { category_id } = req.params
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product_category",
    fields: ["category_images.*"],
    filters: {
      id: category_id,
    },
  })

  const images = data?.[0]?.category_images || []

  res.json({ images })
}
