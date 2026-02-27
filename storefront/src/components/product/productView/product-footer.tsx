import React from "react";
import { HelpCircle, Share2, TruckIcon } from "lucide-react";
import TrustSeal from "@/components/shared/trust-seal";
import { useI18n } from "@lib/hooks/use-i18n";

const ProductFooter: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="space-y-8 mt-8">
            <div className="hidden items-center gap-5 md:gap-8 text-brand-dark font-medium">
                <button className="flex items-center text-sm gap-1">
                    <HelpCircle size={18} />
                    {t('askAQuestion')}
                </button>
                <button className="flex items-center text-sm gap-1">
                    <TruckIcon size={18} />
                    {t('deliveryAndReturn')}
                </button>
                <button className="flex items-center text-sm gap-1">
                    <Share2 size={18} />
                    {t('share')}
                </button>
            </div>
            <TrustSeal />
        </div>
    );
};

export default ProductFooter;