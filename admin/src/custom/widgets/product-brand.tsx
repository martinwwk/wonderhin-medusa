import { AdminProduct } from "@medusajs/types"
import { clx, Container, Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { useTranslation } from "react-i18next"

type AdminProductBrand = AdminProduct & {
  brand?: {
    id: string
    name: string
  }
}

type ProductBrandWidgetProps = {
  data: AdminProduct
}

const ProductBrandWidget = ({ data: product }: ProductBrandWidgetProps) => {
  const { data: queryResult } = useQuery({
    queryFn: () =>
      sdk.admin.product.retrieve(product.id, {
        fields: "+brand.*",
      }),
    queryKey: [["product", product.id]],
  })
  const brandName = (queryResult?.product as AdminProductBrand)?.brand?.name

  const { t } = useTranslation("brands")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">{t("brands.title")}</Heading>
        </div>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Name
        </Text>

        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {brandName || "-"}
        </Text>
      </div>
    </Container>
  )
}

export default ProductBrandWidget
