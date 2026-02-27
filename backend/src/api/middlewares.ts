import {
    defineMiddlewares,
    validateAndTransformBody,
    validateAndTransformQuery,
} from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { PostAdminCreateBrand, PostAdminUpdateBrand } from "./admin/brands/validators"
import { PostAdminCreateCategoryImage } from "./admin/category-media/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetBrandsSchema = createFindParams()


export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/brands",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminCreateBrand),
            ],
        },
        {
            matcher: "/admin/brands/:id",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminUpdateBrand),
            ],
        },
        {
            matcher: "/admin/brands",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(
                    GetBrandsSchema,
                    {
                        defaults: [
                            "id",
                            "name",
                            "products.*",
                        ],
                        isList: true,
                    }
                ),
            ],
        },

        {
            matcher: "/admin/products",
            method: ["POST"],
            additionalDataValidator: {
                brand_id: z.string().optional(),
            },
        },
        {
            matcher: "/admin/category-media/:category_id",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminCreateCategoryImage),
            ],
        },

    ],
})