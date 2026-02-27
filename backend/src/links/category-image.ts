import CategoryImageModule from "../modules/category-image"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.productCategory,
  {
    linkable: CategoryImageModule.linkable.categoryImage,
    isList: true,
  }
)
