import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CATEGORY_IMAGE_MODULE } from "../modules/category-image"
import CategoryImageModuleService from "../modules/category-image/service"
import { LinkDefinition } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export type CreateCategoryImageInput = {
  category_id: string
  url: string
  type?: "thumbnail" | "image"
  name?: string
  mime_type?: string
  size?: number
  rank?: number
  file_id?: string
}

const createCategoryImageStep = createStep(
  "create-category-image-step",
  async (input: CreateCategoryImageInput, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    const { category_id, ...imageData } = input

    const image = await categoryImageService.createCategoryImages(imageData)

    return new StepResponse(image, image.id)
  },
  async (id: string, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    await categoryImageService.deleteCategoryImages(id)
  }
)

const linkCategoryImageStep = createStep(
  "link-category-image-step",
  async (
    input: { category_id: string; image_id: string },
    { container }
  ) => {
    const remoteLink = container.resolve("remoteLink")

    const link: LinkDefinition = {
      [Modules.PRODUCT]: {
        product_category_id: input.category_id,
      },
      [CATEGORY_IMAGE_MODULE]: {
        category_image_id: input.image_id,
      },
    }

    await remoteLink.create(link)

    return new StepResponse(link, link)
  },
  async (link, { container }) => {
    if (!link) return
    const remoteLink = container.resolve("remoteLink")
    await remoteLink.dismiss(link)
  }
)

export const createCategoryImageWorkflow = createWorkflow(
  "create-category-image",
  (input: CreateCategoryImageInput) => {
    const image = createCategoryImageStep(input)

    linkCategoryImageStep({
      category_id: input.category_id,
      image_id: image.id,
    })

    return new WorkflowResponse(image)
  }
)
