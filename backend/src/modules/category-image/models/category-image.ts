import { model } from "@medusajs/framework/utils"

const CategoryImage = model.define("category_image", {
  id: model.id().primaryKey(),
  url: model.text(),
  type: model.enum(["thumbnail", "image"]).default("image"),
  name: model.text().nullable(),
  mime_type: model.text().nullable(),
  size: model.number().nullable(),
  rank: model.number().default(0),
  file_id: model.text().nullable(),
})

export default CategoryImage
