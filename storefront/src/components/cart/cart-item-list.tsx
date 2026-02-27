'use client'
import { CartItem } from "@/components/cart/cart-item"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/shared/table"
import {Item} from "@/lib/util/cart-utils";
import { useI18n } from "@lib/hooks/use-i18n";

interface CartItemListProps {
	items: Item[]
}

export function CartItemList({ items }: CartItemListProps) {
	const { t } = useI18n();
	return (
		<Table>
			<TableHeader>
				<TableRow className="sm:border-b-2">
					<TableHead className="w-[100px]">{t('product')}</TableHead>
					<TableHead className="w-[400px]"></TableHead>
					<TableHead >{t('price')}</TableHead>
					<TableHead >{t('quantity')}</TableHead>
					<TableHead className="w-[100px]">{t('total')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items?.map((item) => (
					<CartItem key={item?.id} item={item} />
				))}
			</TableBody>
		</Table>
	)
}

