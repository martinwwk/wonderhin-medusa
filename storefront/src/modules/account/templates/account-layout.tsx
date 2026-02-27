"use client"

import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import { useClientTranslation } from "@lib/i18n"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const { t } = useClientTranslation()
  
  return (
    <div className="flex-1 min-h-[calc(100vh-112px)] flex flex-col justify-center items-center bg-white" data-testid="account-page">
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-1 py-12">
        {children}
      </div>
      <div className="w-full max-w-5xl mx-auto flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
        <div>
          <h3 className="text-xl-semi mb-4">{t('gotQuestions')}</h3>
          <span className="txt-medium">
            {t('faqText')}
          </span>
        </div>
        <div>
          <UnderlineLink href="/customer-service">
            {t('customerService')}
          </UnderlineLink>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
