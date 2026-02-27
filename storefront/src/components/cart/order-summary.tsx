
'use client'
import { RadioGroup, RadioGroupItem } from "@/components/shared/radio-group"
import React from "react";
import Text from '@/components/shared/text';
import Link from '@/components/shared/link';
import { ROUTES } from '@/utils/routes';
import { useI18n } from "@lib/hooks/use-i18n";

interface ShippingOption {
	id: string
	label: string
	price: number
}

interface OrderSummaryProps {
	subtotal: number
	shippingOptions: ShippingOption[]
	selectedShipping: string
	setSelectedShipping: (id: string) => void
	total: number
}

export function OrderSummary({
	subtotal,
	shippingOptions,
	selectedShipping,
	setSelectedShipping,
	total,
}: OrderSummaryProps) {
	const { t } = useI18n();
	return (
		<div className={" p-5 md:p-8  bg-white  rounded-lg border border-border-base"}>
			<div className="flex items-center justify-between pb-4 mb-5 border-b border-border-base font-medium text-brand-dark">
				<h2 className=" text-lg  ">{t('subtotal')}</h2>
				<span className="text-lg ">${subtotal.toFixed(2)}</span>
			</div>
			<div className="space-y-10">
				<div className="space-y-2">
					<h3 className="text-brand-dark mb-3 font-medium">{t('shipping')}</h3>
					<RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
						{shippingOptions.map((option) => (
							<div key={option.id} className="flex items-center space-x-2">
								<RadioGroupItem value={option.id} id={option.id} />
								<label htmlFor={option.id} className="flex justify-between w-full text-15px">
									<span>{option.label}:</span>
									<span >${option.price.toFixed(2)}</span>
								</label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className="flex justify-between font-bold text-lg pt-6 border-t border-border-base">
					<span>{t('total')}</span>
					<span>${total.toFixed(2)}</span>
				</div>

			</div>
			<Text className="text-15px leading-6 text-gray-500">
				{t('taxesAndShipping')}
			</Text>

			<div className={"mt-6"}>
				<Link
					href={ROUTES.CHECKOUT}
					variant={"button-black"}
					className="w-full block"
				>
					<span className="py-0.5">{t('checkOut')}</span>
				</Link>


			</div>
		</div>
	)
}

