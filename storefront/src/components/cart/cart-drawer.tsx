import Scrollbar from '@/components/shared/scrollbar';
import {useCart} from '@/hooks/use-cart';
import { useUI } from '@/hooks/use-UI';
import usePrice from '@/lib/util/use-price';

import CartItemDrawer from '@/components/cart/cart-item-drawer';
import EmptyCart from '@/components/cart/empty-cart';
import Link from '@/components/shared/link';
import {ROUTES} from '@/utils/routes';

import Heading from '@/components/shared/heading';
import Text from '@/components/shared/text';
import {X} from "lucide-react";
import { useI18n } from "@lib/hooks/use-i18n";

export default function CartDrawer() {
    const {closeDrawer} = useUI();
    const {items, total, isEmpty} = useCart();
    const { t } = useI18n();
    const {price: cartTotal} = usePrice({
        amount: total,
        currencyCode: 'USD',
    });
    return (
        <div className="flex flex-col  w-full h-full px-5 md:px-8 pt-0">
            <div
                className=" relative flex items-center justify-between w-full border-b-2  border-neutral-200/70 dark:border-neutral-700/70 mb-2 md:mb-4">
                <Heading variant="titleMedium">{t('shoppingCart')}</Heading>
                <div className="flex items-center">
                    <button
                        className="flex items-center justify-center text-3xl transition-opacity  py-4  lg:py-5 focus:outline-none text-brand-dark hover:opacity-60"
                        onClick={closeDrawer}
                        aria-label="close"
                    >
                        <X />
                    </button>
                </div>
            </div>
            
            {!isEmpty ? (
                    <>
                        <Scrollbar className="flex-grow w-full cart-scrollbar ">
                            <div className="w-full  h-[calc(100vh_-_300px)]">
                                {items?.map((item) => (
                                    <CartItemDrawer item={item} key={item.id}/>
                                ))}
                            </div>
                        </Scrollbar>
                        <div className="pt-5 pb-5 border-t-2 border-neutral-200/70 dark:border-neutral-700/70  md:pt-6 md:pb-6">
                            <div className="flex pb-5 md:pb-7">
                                <div className="ltr:pr-3 rtl:pl-3">
                                    <Heading className="mb-2.5 " variant={"title"}>{t('subtotal')}:</Heading>
                                    <Text className="leading-6">
                                        {t('taxesAndShipping')}
                                    </Text>
                                </div>
                                <div
                                    className="shrink-0 font-semibold text-base md:text-lg text-brand-dark -mt-0.5 min-w-[80px] ltr:text-right rtl:text-left">
                                    {cartTotal}
                                </div>
                            </div>
                            <div className="grid grid-col1 md:grid-cols-2 gap-5" onClick={closeDrawer}>
                                <Link
                                    href={ROUTES.CART}
                                    variant={"button-border"}
                                >
                                    <span className="py-0.5">{t('viewCart')}</span>
                                </Link>

                                <Link
                                    href={ROUTES.CHECKOUT}
                                    variant={"button-black"}
                                >
                                    <span className="py-0.5">{t('checkOut')}</span>
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyCart/>
                )}
        
        
        </div>
    );
}
