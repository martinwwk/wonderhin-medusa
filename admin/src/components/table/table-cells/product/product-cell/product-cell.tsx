import { useTranslation } from "react-i18next"

import { Thumbnail } from "../../../../common/thumbnail"
import { HttpTypes } from "@medusajs/types"

type ProductCellProps = {
  product: Pick<HttpTypes.AdminProduct, "thumbnail" | "title">
  translatedTitle?: string
}

export const ProductCell = ({ product, translatedTitle }: ProductCellProps) => {
  const displayTitle = translatedTitle || product.title

  return (
    <div className="flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
      <div className="w-fit flex-shrink-0">
        <Thumbnail src={product.thumbnail} />
      </div>
      <span title={displayTitle} className="truncate">
        {displayTitle}
      </span>
    </div>
  )
}

export const ProductHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.product")}</span>
    </div>
  )
}
