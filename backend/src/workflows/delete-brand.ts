import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type DeleteBrandStepInput = {
    id: string
}

type DeleteBrandWorkflowInput = {
    id: string
}

export const deleteBrandStep = createStep(
    "delete-brand-step",
    async (input: DeleteBrandStepInput, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
            BRAND_MODULE
        )

        const [brand] = await brandModuleService.listBrands({
            id: input.id,
        })

        await brandModuleService.deleteBrands(input.id)

        return new StepResponse({ id: input.id }, brand)
    },
    async (brand, { container }) => {
        if (!brand) {
            return
        }

        const brandModuleService: BrandModuleService = container.resolve(
            BRAND_MODULE
        )

        await brandModuleService.createBrands({
            id: brand.id,
            name: brand.name,
        })
    }
)

export const deleteBrandWorkflow = createWorkflow(
    "delete-brand",
    (input: DeleteBrandWorkflowInput) => {
        const result = deleteBrandStep(input)

        return new WorkflowResponse(result)
    }
)
