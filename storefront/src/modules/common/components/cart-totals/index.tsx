"use client"

import { convertToLocale } from "@lib/util/money"
import React, { useMemo } from "react"
import { getServerTranslation } from "@lib/server-i18n"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
  countryCode?: string
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals, countryCode = "en" }) => {
  const subtotalExcl = useMemo(() => getServerTranslation(countryCode, 'subtotalExcl'), [countryCode])
  const shipping = useMemo(() => getServerTranslation(countryCode, 'shipping'), [countryCode])
  const discount = useMemo(() => getServerTranslation(countryCode, 'discount'), [countryCode])
  const taxes = useMemo(() => getServerTranslation(countryCode, 'taxes'), [countryCode])
  const total = useMemo(() => getServerTranslation(countryCode, 'total'), [countryCode])
  const {
    currency_code,
    total: totalAmount,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>{subtotalExcl}</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>{shipping}</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>{discount}</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">{taxes}</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>{total}</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={totalAmount || 0}
        >
          {convertToLocale({ amount: totalAmount ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  )
}

export default CartTotals
