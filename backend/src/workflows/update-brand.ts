import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type UpdateBrandStepInput = {
    id: string
    name: string
}

type UpdateBrandWorkflowInput = {
    id: string
    name: string
}

export const updateBrandStep = createStep(
    "update-brand-step",
    async (input: UpdateBrandStepInput, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
            BRAND_MODULE
        )

        const [previousBrand] = await brandModuleService.listBrands({
            id: input.id,
        })

        const brand = await brandModuleService.updateBrands({
            id: input.id,
            name: input.name,
        })

        return new StepResponse(brand, previousBrand)
    },
    async (previousBrand, { container }) => {
        if (!previousBrand) {
            return
        }

        const brandModuleService: BrandModuleService = container.resolve(
            BRAND_MODULE
        )

        await brandModuleService.updateBrands({
            id: previousBrand.id,
            name: previousBrand.name,
        })
    }
)

export const updateBrandWorkflow = createWorkflow(
    "update-brand",
    (input: UpdateBrandWorkflowInput) => {
        const brand = updateBrandStep(input)

        return new WorkflowResponse(brand)
    }
)
