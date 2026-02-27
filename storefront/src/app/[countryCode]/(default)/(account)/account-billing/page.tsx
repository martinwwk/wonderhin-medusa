"use client";

import Heading from "@/components/shared/heading";
import Text from "@/components/shared/text";
import Button from "@/components/shared/button";
import { useI18n } from "@lib/hooks/use-i18n";

export default function changeBillingPage() {
    const { t } = useI18n();
    
    return (
        <>
            <Heading variant="titleMedium">{t('paymentsAndPayouts')}</Heading>
            <div className="flex flex-col pt-6 2xl:pt-8">
                <Text className="xl:leading-6 lg:mb-6 sm:text-15px">
                    {t('paymentPlatformDescription')}
                </Text>
                <Text className="xl:leading-6 lg:mb-6 text-15px">
                    {t('payoutMethodDescription')}
                </Text>
            </div>
            <div className="relative mt-3">
                <Button
                    type="submit"
                    variant="formButton"
                    className="w-full sm:w-auto"
                >
                    {t('addPayoutMethod')}
                </Button>
            </div>
        </>
    );
}
