import { z } from "@medusajs/framework/zod"

export const PostAdminCreateCategoryImage = z.object({
  url: z.string(),
  type: z.enum(["thumbnail", "image"]).default("image"),
  name: z.string().optional(),
  mime_type: z.string().optional(),
  size: z.number().optional(),
  rank: z.number().optional(),
  file_id: z.string().optional(),
})
