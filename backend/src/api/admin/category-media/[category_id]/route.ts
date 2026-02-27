import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createCategoryImageWorkflow } from "../../../../workflows/create-category-image"
import { z } from "@medusajs/framework/zod"
import { PostAdminCreateCategoryImage } from "../validators"

type PostAdminCreateCategoryImageType = z.infer<
  typeof PostAdminCreateCategoryImage
>

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

export const POST = async (
  req: MedusaRequest<PostAdminCreateCategoryImageType>,
  res: MedusaResponse
) => {
  const { category_id } = req.params

  const { result } = await createCategoryImageWorkflow(req.scope).run({
    input: {
      category_id,
      ...req.validatedBody,
    },
  })

  res.json({ image: result })
}
