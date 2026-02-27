import { Module } from "@medusajs/framework/utils"
import CategoryImageModuleService from "./service"

export const CATEGORY_IMAGE_MODULE = "categoryImage"

export default Module(CATEGORY_IMAGE_MODULE, {
  service: CategoryImageModuleService,
})
