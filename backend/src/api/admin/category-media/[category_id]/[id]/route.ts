import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { deleteCategoryImageWorkflow } from "../../../../../workflows/delete-category-image"

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { category_id, id } = req.params

  const { result } = await deleteCategoryImageWorkflow(req.scope).run({
    input: {
      id,
      category_id,
    },
  })

  res.json(result)
}
