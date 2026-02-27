import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { createServerTranslator } from "@lib/server-i18n"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
  countryCode: string
}

const ItemsTemplate = ({ cart, countryCode }: ItemsTemplateProps) => {
  const t = createServerTranslator(countryCode)
  const items = cart?.items
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">{t('cart')}</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="pr-4 py-4 text-left">{t('item')}</Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-4 text-left"></Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-4 text-left">{t('quantity')}</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell px-4 py-4 text-right">
              {t('price')}
            </Table.HeaderCell>
            <Table.HeaderCell className="pl-4 py-4 text-right">
              {t('total')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                      countryCode={countryCode}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
