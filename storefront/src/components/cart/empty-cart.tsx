'use client'
import Heading from '@/components/shared/heading';
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import CartEmptyIcon from "@/components/icons/cart-empty-icon";
import { useI18n } from "@lib/hooks/use-i18n";

function EmptyCart() {
    const { t } = useI18n();
    return (
        <div className="flex flex-col h-2/3 items-center justify-center ">
            <div className="flex mx-auto  md:w-auto">
                <CartEmptyIcon className={"text-gray-400"}/>
            </div>
            <Heading variant="titleMedium" className="pt-8 pb-7">
                {t('yourCartIsEmpty')}
            </Heading>
            <Link href={ROUTES.HOME} variant={"button-black"} className={"min-w-50"}>
                {t('continueShopping')}
            </Link>
        </div>
    );
}

export default EmptyCart;
