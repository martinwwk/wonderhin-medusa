import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CATEGORY_IMAGE_MODULE } from "../modules/category-image"
import CategoryImageModuleService from "../modules/category-image/service"
import { Modules } from "@medusajs/framework/utils"

export type DeleteCategoryImageInput = {
  id: string
  category_id: string
}

const unlinkCategoryImageStep = createStep(
  "unlink-category-image-step",
  async (
    input: { category_id: string; image_id: string },
    { container }
  ) => {
    const remoteLink = container.resolve("remoteLink")

    const link = {
      [Modules.PRODUCT]: {
        product_category_id: input.category_id,
      },
      [CATEGORY_IMAGE_MODULE]: {
        category_image_id: input.image_id,
      },
    }

    await remoteLink.dismiss(link)

    return new StepResponse(link, link)
  },
  async (link, { container }) => {
    if (!link) return
    const remoteLink = container.resolve("remoteLink")
    await remoteLink.create(link)
  }
)

const deleteCategoryImageStep = createStep(
  "delete-category-image-step",
  async (input: { id: string }, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    const [image] = await categoryImageService.listCategoryImages({
      id: input.id,
    })

    await categoryImageService.deleteCategoryImages(input.id)

    return new StepResponse(input.id, image)
  },
  async (image, { container }) => {
    if (!image) return
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    await categoryImageService.createCategoryImages(image)
  }
)

export const deleteCategoryImageWorkflow = createWorkflow(
  "delete-category-image",
  (input: DeleteCategoryImageInput) => {
    unlinkCategoryImageStep({
      category_id: input.category_id,
      image_id: input.id,
    })

    deleteCategoryImageStep({ id: input.id })

    return new WorkflowResponse({ id: input.id, deleted: true })
  }
)
