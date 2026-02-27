import { MedusaService } from "@medusajs/framework/utils"
import CategoryImage from "./models/category-image"

class CategoryImageModuleService extends MedusaService({
  CategoryImage,
}) {}

export default CategoryImageModuleService
