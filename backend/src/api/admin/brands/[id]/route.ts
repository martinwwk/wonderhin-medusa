import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { updateBrandWorkflow } from "../../../../workflows/update-brand"
import { deleteBrandWorkflow } from "../../../../workflows/delete-brand"
import { z } from "@medusajs/framework/zod"
import { PostAdminUpdateBrand } from "../validators"

type PostAdminUpdateBrandType = z.infer<typeof PostAdminUpdateBrand>

export const POST = async (
    req: MedusaRequest<PostAdminUpdateBrandType>,
    res: MedusaResponse
) => {
    const { id } = req.params

    const { result } = await updateBrandWorkflow(req.scope)
        .run({
            input: {
                id,
                ...req.validatedBody,
            },
        })

    res.json({ brand: result })
}

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { id } = req.params

    await deleteBrandWorkflow(req.scope)
        .run({
            input: { id },
        })

    res.json({ id, deleted: true })
}
